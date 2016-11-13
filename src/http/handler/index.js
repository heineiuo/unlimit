import {Router} from 'express'
import Url from 'url'
import Host from '../../intergation/gateway/host'
import Location from '../../intergation/gateway/location'

module.exports = (config) => {

  const router = Router();

  /**
   * 查询host
   */
  router.use(async (req, res, next) => {
    try {

      /**e
       * 查找host及其location列表
       */
      const {host} = req.headers;
      const doc = await Host.Get(host);
      const {locations} = await Location.get(host);
      const sortedLocations = Object.values(locations).sort((a, b) => a.sort > b.sort);
      const url = res.locals.url = Url.parse(req.url);

      /**
       * 通过比对pathname, 找到路由
       */
      let found = false;
      sortedLocations.some( item => {
        const reg = new RegExp(
          item.pathname.substr(1, item.pathname.length - 2).replace('\\\\','\\')
        );
        const matches = url.pathname.match(reg);
        if (matches && matches[0] == url.pathname) {
          item.type = item.type.toUpperCase();
          res.locals.host = doc;
          res.locals.location = item;
          found = true;
          if (config.debug) console.log(doc, item);
        }
        return found
      });

      if (!found) return next('LOCATION_NOT_FOUND');
      if (res.locals.location.cors){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Expose-Headers', '*');
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
        res.set('Access-Control-Allow-Methods', '*')
      }

      res.set("X-Frame-Options", "SAMEORIGIN");

      next()
    } catch(e){
       next(e)
    }
  });

  router.use(require('./seashell'));
  router.use(require('./file'));
  router.use(require('./proxy'));
  router.use(require('./block'));
  router.use(require('./redirect'));
  router.use(require('./json'));
  router.use(require('./html'));
  router.use(require('./lambda'));
  router.use(require('./download'));

  /**
   * TODO DEPRECATED
   * `api`是唯一一个自带路由的
   * 或许目前没有方法让用户自定义这一块的路由
   */
  // routes.use(require('./api'))

  /**
   * 未定义的type类型
   */
  router.use((req, res, next) => {
    next('ILLEGAL_HTTP_REQUEST')
  });

  /**
   * 处理proxy内遇到的异常和错误
   * `HOST_NOT_FOUND` 即没有错误, 交给http_server
   * `LOCATION_NOT_FOUND` 即404
   * `UNDEFINED_TYPE` 用户非法请求
   *
   * 其他 err交给全局err处理器
   */
  router.use(async (err, req, res, next) => {
    if (config.debug) console.log(err.stack||err);
    if (err == 'HOST_NOT_FOUND') return next();
    if (err == 'LOCATION_NOT_FOUND') return res.end(`${req.headers.host}: LOCATION NOT FOUND`);
    if (err == 'UNDEFINED_TYPE') return res.end(`${req.headers.host}: CONFIGURE ERROR`);
    if (err == 'NOT_FOUND') return next();
    return res.end(`${req.headers.host}: EXCEPTION ERROR`);
  });

  return router
};