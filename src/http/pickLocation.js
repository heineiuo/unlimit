import Url from 'url'
import {Router} from 'express'
import pathToRegexp from 'path-to-regexp'

const pickLocationMiddleware = (seashell) => {

  return async (req, res, next) => {

    try {
      /**e
       * 查找host及其location列表
       */
      const {host} = req.headers;
      // console.log('[gateway] searching host');
      // console.log(requestHost.body);
      // console.log('START REQUEST GATEWAY FOR LOCATION INFOMATION')
      const requestLocations = await seashell.requestSelf({
        headers: {originUrl: '/drive/getByHostname'},
        body: { hostname: host}
      });
      if (requestLocations.body.error) throw new Error(requestLocations.body.error);
      const {location: {locations}, driveId} = requestLocations.body;
      // console.log('locations: '+JSON.stringify(locations));
      const {location, url} = await pickLocation(locations, req.url);

      // console.log(drive);
      res.locals.host = host;
      res.locals.driveId = driveId;
      res.locals.url = url;
      // res.locals.drive = drive;
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
    const url = Url.parse(requrl);

    /**
     * 通过比对pathname, 找到路由
     */
    const targetLocation = findTargetLocation(locations, url);

    const location = targetLocation?targetLocation: {
      pathname: '*',
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

const findTargetLocation = (locations, url) => {
  return locations.find(item => {
    const re = pathToRegexp(item.pathname);
    const matches = url.pathname.match(re);
    return matches && matches[0] === url.pathname;
  });
};

export {
  findTargetLocation,
  pickLocationMiddleware,
  pickLocation
}