import Url from 'url'
import {Router} from 'express'
import {combineReducers} from 'sprucejs'

module.exports = (config, db) => {

  const handler = combineReducers([
    require('../integration/gateway/Host'),
    require('../integration/gateway/Location')
  ])(db);

  return async (req, res, next) => {

    try {

      /**e
       * 查找host及其location列表
       */
      const {host} = req.headers;
      // console.log('[gateway] searching host');
      const doc = await handler({reducerName: 'host', hostname: host, action: 'Get'});
      // console.log('doc: '+JSON.stringify(doc));
      const list = await handler({reducerName: 'location', hostname: host, action: 'list'});
      const {locations} = list.location;
      // console.log('locations: '+JSON.stringify(locations));
      const {location, url} = await pickLocation(locations, req.url);

      // console.log(location);
      res.locals.host = doc;
      res.locals.url = url;
      // res.locals.location = location;
      res.locals.location = Object.assign({}, location, {content: location.content});

      if (location.cors) {
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
    } catch(e) {
      next(e)
    }
  }


};

const pickLocation = (locations, requrl) => new Promise((resolve, reject) => {
  try {
    const sortedLocations = Object.values(locations).sort((a, b) => a.sort > b.sort);
    const url = Url.parse(requrl);

    // console.log(sortedLocations);

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

    if (!found) {
      resolve({
        url,
        location: {
          pathname: '/^.*$/',
          type: 'FILE'
        }
      })
    }

  } catch(e){
    reject(new Error('LOCATION_NOT_FOUND'))
  }
});

