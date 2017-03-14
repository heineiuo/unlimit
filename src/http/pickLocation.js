import Url from 'url'
import {Router} from 'express'

module.exports = () => {

  return async (req, res, next) => {

    try {
      const {gateway} = res;

      /**e
       * 查找host及其location列表
       */
      const {host} = req.headers;
      // console.log('[gateway] searching host');
      const requestHost = await gateway.handler({reducerName: 'host', hostname: host, action: 'Get'});
      // console.log(requestHost.body);
      if (requestHost.error) throw new Error(requestHost.error);
      const requestLocations = await gateway.handler({reducerName: 'location', hostname: host, action: 'list'});
      // console.log(requestLocations.body);
      const {locations} = requestLocations.location;
      // console.log('locations: '+JSON.stringify(locations));
      const {location, url} = await pickLocation(locations, req.url);

      // console.log(location);
      res.locals.host = requestHost;
      res.locals.url = url;
      // res.locals.location = location;
      res.locals.location = Object.assign({}, location, {content: location.content});

      if (location.cors) {
        res.set('Access-Control-Expose-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With');
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
    // const sortedLocations = Object.values(locations).sort((a, b) => a.sort > b.sort);
    const url = Url.parse(requrl);

    console.log(locations);

    /**
     * 通过比对pathname, 找到路由
     */
    const targetLocation = locations.find(item => {
      const reg = new RegExp(
        item.pathname.substr(1, item.pathname.length - 2).replace('\\\\','\\')
      );
      const matches = url.pathname.match(reg);
      return matches && matches[0] == url.pathname;
    });

    const location = targetLocation?targetLocation: {
      pathname: '/^.*$/',
      type: 'FILE'
    };

    try {
      location.content = JSON.parse(location.content);
    } catch(e){}

    resolve({url, location});

  } catch(e){
    reject(new Error('LOCATION_NOT_FOUND'))
  }
});

