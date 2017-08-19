import Url from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import isIp from 'is-ip'


/**e
 * 查找host及其location列表
 */
export default () => async (req, res, next) => {
  try {
    const { HTTPS_FORCE_DOMAINS, API_DOMAIN } = process.env
    const forceHTTPSDomains = HTTPS_FORCE_DOMAINS.split(',')
    const {host} = req.headers
    let locations = []
    let driveId = ''
    if (isIp(host)) {
      res.status(403)
      return res.json({
        error: 'ForbiddenError',
        message: 'Cound not access by ip address'
      })
    }
    if (host === API_DOMAIN) {
      locations = [{
        "pathname": "*",
        "cors": true,
        "type": "SEASHELL",
        "content": ""
      }]
    } else {
      const {body} = await seashell.requestSelf({
        headers: {originUrl: '/drive/queryOneByDomain'},
        body: {domain: host, fields: ['locations']}
      })
      if (body.error) {
        return res.json(body)
      }

      driveId = body.driveId
      locations = body.locations
    }

    const {location, url} = await pickLocation(locations, req.url)
    Object.assign(res.locals, {
      host, driveId, url, location
    })

    if (location.cors) {
      res.set('Access-Control-Expose-Headers', '*')
      // IE8 does not allow domains to be specified, just the *
      // headers["Access-Control-Allow-Origin"] = req.headers.origin
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With')
      res.set('Access-Control-Allow-Methods', '*')

      if (req.method === 'OPTIONS') {
        res.set("Access-Control-Max-Age", '86400')
        return res.end()
      }
    }

    if (location['X-Frame-Options']) {
      res.set('X-Frame-Options', location['X-Frame-Options'])
    }

    res.removeHeader("x-powered-by")

    if (forceHTTPSDomains.indexOf(req.headers.host) > -1) {
      if (req.protocol === 'http') {
        const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser()
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

/**
 * 通过比对pathname, 找到路由
 */
export const pickLocation = (locations, requrl) => new Promise((resolve, reject) => {
  try {
    const url = Url.parse(requrl)
    const targetLocation = locations.find(item => {
      const re = pathToRegexp(item.pathname)
      // console.log(re, item.pathname, url)
      const matches = url.pathname.match(re)
      return matches && matches[0] === url.pathname
    })

    const location = !!targetLocation ? targetLocation : {
      pathname: '*',
      type: 'FILE'
    }

    try {
      location.content = JSON.parse(location.content)
    } catch (e) {
    }

    resolve({url, location})
  } catch (e) {
    const error = new Error('Location not found')
    error.name = 'NotFoundError'
    reject(error)
  }
})
