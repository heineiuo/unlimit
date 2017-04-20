/**
 * This is an example integration, you should not use it directly in production.
 *
 * This integration shows how to proxy a http request to seashell,
 * this means you can write http api by seashell technology, then the only thing you
 * need do is the proxy.
 * This integration also show how to control an http service(like stop or restart), from seashell
 */

import createAutoSNIServer from 'auto-sni'
import morgan from 'morgan'
import compression from 'compression'
import express from 'express'

import pickLocation from './pickLocation'
import execLocation from './execLocation'
import proxySeashell from './proxySeashell'

/**
 * @param config
 *   "agreeTos": true,
 *    "debug": false,
 *    "email": "heineiuo@gmail.com",
 *    "approvedDomains": [
 *    ],
 *    "domains": [
 *       []
 *    ]
 * @param seashell
 *  {
 *    handler: () => promise,
 *    request: () => promise
 *  }
 * @returns {*}
 */
const createServer = (config, seashell) => {
  const {email, debug, domains, approvedDomains} = config;

  const app = express();

  app.use(morgan('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
  app.use(compression());

  /**
   * 1. 先获取location， 并处理http-https跳转
   * 2. 如果location.type是seashell，则先请求seashell，
   *  如果seashell请求结果是直接返回结果，则直接返回，不经过execLocation，
   *  否则更新res.locals.location， 并交给execLocation继续处理
   * 3. execLocation能处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
   */
  app.use(pickLocation(seashell, approvedDomains));
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
    console.log('Catch Error: \n' + err.stack||err);
    return res.json({error: err.message});
  });

  app.use((req, res) => {
    res.status(404);
    res.end('NOT FOUND \n SEASHELL SERVER.')
  });


  const server = createAutoSNIServer({
    email,
    debug,
    // domains: (hostname, callback) => callback(null, [hostname]),
    domains,
    agreeTos: true,
    forceSSL: false,
    redirectCode: 301,
    ports: {
      http: 80,
      https: 443
    }
  }, app).once("listening", () => console.log("[SEASHELL] Listening on port 443 and 80."));

  return server

};

export default createServer