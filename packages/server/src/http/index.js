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
import fs from 'mz/fs'
import path from 'path'
import tls from 'tls'

import pickLocation from "./location"
import execLocation from "./handle"
import proxySeashell from "./SeashellProxy"

let seashell = null;

const getSeashell = () => new Promise((resolve, reject) => {
  if (seashell) return resolve(seashell);
  reject(new Error('Seashell not ready'));
})

const createApp = (config) => {
    
  const app = express();

  app.use(morgan('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
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
    if (!['NotFoundError', 'ValidationError'].includes(err.name)) {
      console.log('Catch Error: \n' + err.message);
    }
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

const ctxMap = {}

const SNICallback = (config) => (servername, callback) => {
  const {https: {approvedDomains}, datadir} = config;
  const pemdir = datadir + '/pem';
  if (ctxMap[servername]) return callback(null, ctxMap[servername]);
  if (!approvedDomains.includes(servername)) {
    console.log('Unapproved domain')
    return callback(new Error('Unapproved domain'));
  }
  fs.readFile(`${pemdir}/${servername}/pfx.pem`, (err, pfx) => {
    if (err) {
      console.log(err)
      return callback(err)
    }
    const ctx = ctxMap[servername] = tls.createSecureContext({pfx})
    callback(null, ctx)
  })
}

export default (config) => {
  const app = createApp(config);
  const server = http.createServer(app);
  const enableHttps = config.https.enable || false;
  if (!enableHttps) {
    server.run = (s) => run(s, server);
    return server;
  }

  const secureServer = https.createServer({SNICallback: SNICallback(config)}, app);
  secureServer.run = (s) => run(s, server, secureServer);
  return secureServer

};

