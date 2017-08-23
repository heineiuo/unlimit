import Url from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import isIp from 'is-ip'
import { expressJQL } from '@jql/server'
import { proxySeashell, proxyHttp, proxyWs } from './proxy'
import { actions as internalActions } from './internal'

/**e
 * 查找host及其location列表
 */
export const routerMiddleware = (options) => async (req, res, next) => {
  try {
    const { getDb } = options
    const { host } = req.headers
    if (isIp(host)) {
      res.status(403)
      return res.json({
        error: 'ForbiddenError',
        message: 'Cound not access by ip address'
      })
    }

    res.removeHeader("x-powered-by")
    
    const { HTTPS_FORCE_DOMAINS, API_DOMAIN } = process.env
    const forceHTTPSDomains = HTTPS_FORCE_DOMAINS.split(',')
    if (forceHTTPSDomains.indexOf(req.headers.host) > -1) {
      if (req.protocol === 'http') {
        const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser()
        if (browser.name !== 'IE' || (browser.name === 'IE' && Number(browser.major) >= 9)) {
          return res.redirect(`https://${req.headers.host}${req.originalUrl}`)
        }
      }
    }

    const db = await getDb()

    /**
     * {
     *   locations: []
     * }
     */
    let domainData = {
      locations: []
    }

    if (host === API_DOMAIN) {
      domainData.locations = [{
        "pathname": "*",
        "cors": true,
        "type": "SEASHELL",
        "content": ""
      }]
    } else {
      const result = await db.collection('domains').findOne({
        domain: host,
      }, {
        fields: ['locations']
      })

      domainData.locations = body.locations
    }

    /**
     * 根据请求的地址，请求的域名对应的路由信息查出将要执行的路由，并执行
     */
    const {location, url} = await pickLocation(domainData.locations, req.url)
    Object.assign(res.locals, {
      host, 
      url, 
      location
    })

    // TODO use jql rewrite, do not handle in next middlewales, just in a sandbox

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

    next()

  } catch (e) {
    next(e)
  }
}

export const routerUpdate = () => new Promise((resolve, reject) => {
  
})

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
