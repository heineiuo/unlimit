import Url from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import getConfig from '../config'

/**
 * 通过比对pathname, 找到路由
 */
export const pickLocation = (locations, requrl) => new Promise((resolve, reject) => {
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

export const findTargetLocation = (locations, url) => {
  return locations.find(item => {
    const re = pathToRegexp(item.pathname);
    const matches = url.pathname.match(re);
    return matches && matches[0] === url.pathname;
  });
};


/**e
 * 查找host及其location列表
 */
export default (getSeashell) => {
  return async (req, res, next) => {
    try {
      const seashell = await getSeashell();
      const {host} = req.headers;
      const {forceHTTPSDomains} = (await getConfig()).https;
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
      res.locals.location = location;

      if (location.cors) {
        res.set('Access-Control-Expose-Headers', '*');
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With');
        res.set('Access-Control-Allow-Methods', '*')

        if (req.method === 'OPTIONS') {
          res.set("Access-Control-Max-Age", '86400')
          return res.end();
        }
      }

      if (location['X-Frame-Options']) {
        res.set('X-Frame-Options', location['X-Frame-Options']);
      }

      res.removeHeader("x-powered-by");

      if (forceHTTPSDomains.indexOf(req.headers.host) > -1) {
        if (req.protocol === 'http') {
          const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser();
          if (browser.name !== 'IE' || (browser.name === 'IE' && Number(browser.major) >= 9)) {
            return res.redirect(`https://${req.headers.host}${req.originalUrl}`)
          }
        }
      }

      next()

    } catch (e) {
      next(e)
    }
  }
};
