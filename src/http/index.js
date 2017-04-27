/**
 * This is an example integration, you should not use it directly in production.
 *
 * This integration shows how to proxy a http request to seashell,
 * this means you can write http api by seashell technology, then the only thing you
 * need do is the proxy.
 * This integration also show how to control an http service(like stop or restart), from seashell
 */

import morgan from "morgan"
import compression from "compression"
import express from "express"
import {homedir} from "os"
import http from "http"
import https from "https"
import pickLocation from "./pickLocation"
import execLocation from "./execLocation"
import proxySeashell from "./proxySeashell"
import getConfig from "../config"
import greenlock from 'greenlock'
import redirectHttps from 'redirect-https'

const app = express();

/**
 * @param seashell
 * @param server
 * @param [secureServer]
 */
const run = (seashell, server, secureServer) => {

  app.use(morgan('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
  app.use(compression());

  /**
   * 1. 先获取location， 并处理http-https跳转
   * 2. 如果location.type是seashell，则先请求seashell，
   *  如果seashell请求结果是直接返回结果，则直接返回，不经过execLocation，
   *  否则更新res.locals.location， 并交给execLocation继续处理
   * 3. execLocation能处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
   */
  app.use(pickLocation(seashell));
  app.use(proxySeashell(seashell));
  app.use(execLocation(seashell));

  app.use((err, req, res, next) => {
    if (!err) return next();
    /**
     * 即没有找到host，返回404
     */
    if (err.message === 'HOST_NOT_FOUND') return next();
    /**
     * 即没有找到location，404
     */
    if (err.message === 'LOCATION_NOT_FOUND') return res.end(`${req.headers.host}: \n LOCATION NOT FOUND`);
    /**
     * 用户非法请求
     */
    if (err.message === 'UNDEFINED_TYPE') return res.end(`${req.headers.host}: \n CONFIGURE ERROR`);
    if (err.message === 'NOT_FOUND') return next();
    console.log('Catch Error: \n' + err.stack || err);
    return res.json({error: err.message});
  });

  app.use((req, res) => {
    res.status(404);
    res.end('NOT FOUND \n SEASHELL SERVER.')
  });

  server.listen(80, () => console.log('http on port 80'))
  if (secureServer) secureServer.listen(443, () => console.log('http on port 443'))
}


export default () => new Promise(async (resolve, reject) => {
  let server = null;
  let secureServer = null;

  try {
    const config = await getConfig();
    const enableHttps = config.https.enable || false;
    if (!enableHttps) {
      server = http.createServer(app);
      server.run = (seashell) => run(seashell, server);
      return resolve(server);
    }


    const {email, agreeTos, debug, approvedDomains} = config.https;
    const le = greenlock.create({
      app,
      debug,
      email,
      agreeTos,
      server: debug ? 'staging' : 'production',
      configDir: `${homedir()}/letsencrypt/etc`,
      approvedDomains
    })

    server = http.createServer(app);
    // server = http.createServer(le.middleware(redirectHttps()));

    secureServer = https.createServer(le.httpsOptions, le.middleware(le.app))
    secureServer.run = (seashell) => run(seashell, server, secureServer)
    return resolve(secureServer)

  } catch (e) {
    reject(e)
  }
});

