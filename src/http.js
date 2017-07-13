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
import letiny from 'letiny'
import {tmpdir} from 'os'

import pickLocation from "../actions/http/location"
import execLocation from "../actions/http"
import proxySeashell from "../actions/http/SeashellProxy"

let seashell = null;

const getSeashell = () => new Promise((resolve, reject) => {
  if (seashell) return resolve(seashell);
  rereject(new Error('Seashell not ready'));
})

const createApp = (config) => {
    
  const app = express();

  // app.use(morgan('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
  app.use(compression());

  app.use(letiny.webrootChallengeMiddleware(tmpdir()));

  /**
   * 1. 先获取location， 并处理http-https跳转
   * 2. 如果location.type是seashell，则先请求seashell，
   *  如果seashell请求结果是直接返回结果，则直接返回，不经过execLocation，
   *  否则更新res.locals.location， 并交给execLocation继续处理
   * 3. execLocation能处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
   */
  app.use(pickLocation(getSeashell, config));
  app.use(proxySeashell(getSeashell));
  app.use(execLocation(getSeashell));

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

  return app
}

/**
 * @param seashell
 * @param server
 * @param [secureServer]
 */
const run = (s, server, secureServer) => {
  seashell = s;
  server.listen(80, () => console.log('http on port 80'))
  if (secureServer) secureServer.listen(443, () => console.log('http on port 443'))
}

import fs from 'mz/fs'
import path from 'path'
import tls from 'tls'

const ctxMap = {}

const SNICallback = (config) => (servername, callback) => {
  process.nextTick(async () => {

    try {
      const {https: {approvedDomains}, datadir} = await getConfig();
      const pemdir = datadir + '/pem';
      console.log('servername: '+servername)
      console.log('pemdir: ' + pemdir)
      if (ctxMap[servername]) return callback(null, ctxMap[servername]);
      console.log('is approved: ' + approvedDomains.includes(servername))
      if (!approvedDomains.includes(servername)) return callback(new Error('Unapproved domain'));
      console.log('start create secure context..')
      const ctx = ctxMap[servername] = tls.createSecureContext({
        pfx: await fs.readFileSync(`${pemdir}/${servername}/pfx.pem`),
        // ca: await fs.readFileSync(`${pemdir}/${servername}/ca.pem`),
        // key: await fs.readFileSync(`${pemdir}/${servername}/key.pem`),
        // cert: await fs.readFileSync(`${pemdir}/${servername}/cert.pem`)
      })
      console.log(ctx);
      callback(null, ctx)
    } catch(e){
      console.log(e);
      callback(e)
    }

  })
}

export default (config) => new Promise(async (resolve, reject) => {
  let secureServer = null;

  try {
    const server = http.createServer(createApp(config));
    const enableHttps = config.https.enable || false;
    if (!enableHttps) {
      server.run = (s) => run(s, server);
      return resolve(server);
    }

    secureServer = https.createServer({SNICallback: SNICallback(config)}, app);
    secureServer.run = (s) => run(s, server, secureServer);
    return resolve(secureServer)

  } catch (e) {
    reject(e)
  }
});

