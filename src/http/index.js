import createServer from 'auto-sni'
import morgan from 'morgan'
import compression from 'compression'
import express from 'express'

export default (config, gateway) => {

  const app = express();

  app.use(morgan(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
  app.use(compression());
  app.use((req, res, next) => {
    res.gateway = gateway;
    res.removeHeader("x-powered-by");
    next()
  });

  app.use(require('./redirectToHttps')(config));
  app.use(require('./pickLocation')());

  /**
   * 先判断是否需要经过seashell请求，如果是，则等待seashell请求，请求结果如果是继续操作，则修改res.locals.location等
   * 对象，并交给handler处理，如果请求结果是直接返回结果，则直接返回，不经过handler。
   * handler处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
   */
  app.use(require('./seashellProxy')(config));
  app.use(require('./handler')(config));
  app.use(require('./httpProxy')(config, app));


  /**
   * 处理handler内遇到的异常和错误
   * `HOST_NOT_FOUND` 即没有找到host，返回404
   * `LOCATION_NOT_FOUND` 即没有找到location，404
   * `UNDEFINED_TYPE` 用户非法请求
   *
   * 其他的错误显示异常
   */
  app.use((err, req, res, next) => {
    console.log(err.stack);
    if (err.message == 'HOST_NOT_FOUND') return next();
    if (err.message == 'LOCATION_NOT_FOUND') return res.end(`${req.headers.host}: \n LOCATION NOT FOUND`);
    if (err.message == 'UNDEFINED_TYPE') return res.end(`${req.headers.host}: \n CONFIGURE ERROR`);
    if (err.message == 'NOT_FOUND') return next();
    return res.end(`${req.headers.host}: \n EXCEPTION ERROR`);
  });

  app.use((req, res) => {
    res.status(404);
    res.end('NOT FOUND \n SEASHELL SERVER.')
  });

  const server = createServer({
    email: config.production.https.email,
    agreeTos: true,
    debug: config.production.https.debug,
    domains: config.production.https.domains,
    forceSSL: false,
    redirectCode: 301,
    ports: {
      http: 80,
      https: 443
    }
  }, app).once("listening", () => console.log("[gateway] Listening on port 443 and 80."));

  return server

};