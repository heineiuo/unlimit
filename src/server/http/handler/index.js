import {Router} from 'express'
import Url from 'url'
import {combineReducers} from 'sprucejs'

const pickLocation = (locations, requrl) => new Promise((resolve, reject) => {
  try {
    const sortedLocations = Object.values(locations).sort((a, b) => a.sort > b.sort);
    const url = Url.parse(requrl);

    console.log(sortedLocations);


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
        // res.locals.host = doc;
        // res.locals.location = item;
        found = true;
        resolve({
          url,
          location: item
        });

      }
      return found
    });

    if (!found) return reject(new Error('LOCATION_NOT_FOUND'))

  } catch(e){
    reject(new Error('LOCATION_NOT_FOUND'))
  }
});

module.exports = (db, config) => {

  const router = Router();

  const handler = combineReducers([
    require('../../integration/gateway/host'),
    require('../../integration/gateway/location')
  ])(db);

  /**
   * 查询host
   */
  router.use(async (req, res, next) => {
    try {

      /**e
       * 查找host及其location列表
       */
      const {host} = req.headers;
      console.log('[gateway] searching host');
      const doc = await handler({reducerName: 'host', hostname: host, action: 'Get'});
      console.log('doc: '+JSON.stringify(doc));
      const list = await handler({reducerName: 'location', hostname: host, action: 'list'});
      const {locations} = list.location;
      console.log('locations: '+JSON.stringify(locations));
      const {location, url} = await pickLocation(locations, req.url);

      console.log(location);
      res.locals.host = doc;
      res.locals.url = url;
      res.locals.location = location;
      if (location.cors){
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Expose-Headers', '*');
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
        res.set('Access-Control-Allow-Methods', '*')
      }

      if (location['X-Frame-Options']) {
        const value = location['X-Frame-Options'] || 'SAMEORIGIN';
        res.set("X-Frame-Options", value);
      }

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
    console.log(err.stack||err);
    if (err.message == 'HOST_NOT_FOUND') return next();
    if (err.message == 'LOCATION_NOT_FOUND') return res.end(`${req.headers.host}: LOCATION NOT FOUND`);
    if (err.message == 'UNDEFINED_TYPE') return res.end(`${req.headers.host}: CONFIGURE ERROR`);
    if (err.message == 'NOT_FOUND') return next();
    return res.end(`${req.headers.host}: EXCEPTION ERROR`);
  });

  return router
};