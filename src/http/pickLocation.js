import Url from "url"
import pathToRegexp from "path-to-regexp"

/**e
 * 查找host及其location列表
 */
const pickLocationMiddleware = (seashell) => {
  return async (req, res, next) => {
    try {
      const {host} = req.headers;
      const requestLocations = await seashell.requestSelf({
        headers: {originUrl: '/drive/queryOneByDomain'},
        body: {domain: host, fields: ['locations']}
      });
      if (requestLocations.body.error) return next(new Error(requestLocations.body.error));
      const {locations, driveId} = requestLocations.body;
      const {location, url} = await pickLocation(locations, req.url);

      res.locals.host = host;
      res.locals.driveId = driveId.toString();
      res.locals.url = url;
      res.locals.location = Object.assign({
        'X-Frame-Options': 'SAMEORIGIN'
      }, location, {content: location.content});

      if (location.cors) {
        res.set('Access-Control-Expose-Headers', '*');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With');
        res.set('Access-Control-Allow-Methods', '*')
      }

      res.set('X-Frame-Options', location['X-Frame-Options']);

      next()
    } catch (e) {
      next(e)
    }
  }
};

/**
 * 通过比对pathname, 找到路由
 */
const pickLocation = (locations, requrl) => new Promise((resolve, reject) => {
  try {
    const url = Url.parse(requrl);
    const targetLocation = findTargetLocation(locations, url);
    const location = targetLocation ? targetLocation : {
      pathname: '*',
      type: 'FILE'
    };

    try {
      location.content = JSON.parse(location.content);
    } catch (e) {
    }

    resolve({url, location});
  } catch (e) {
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