import { URL } from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import isIp from 'is-ip'
import { proxySeashell, proxyHttp, proxyWs } from './response/proxy'
import { internalLocations, middleware } from './internal'


let isInit = false

/**e
 * 查找host及其location列表
 */
export const routerMiddleware = (options) => async (req, res, next) => {
  try {
    const { getDb } = options
    const fullUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`
    const { hostname, pathname } = new URL(fullUrl)
    if (isIp(hostname)) {
      res.status(403)
      return res.json({
        error: 'ForbiddenError',
        message: 'Cound not access by ip address'
      })
    }
  
    const { HTTPS_FORCE_DOMAINS } = process.env
    const forceHTTPSDomains = HTTPS_FORCE_DOMAINS.split(',')
    if (forceHTTPSDomains.indexOf(hostname) > -1) {
      if (req.protocol === 'http') {
        const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser()
        if (browser.name !== 'IE' || (browser.name === 'IE' && Number(browser.major) >= 9)) {
          return res.redirect(`https://${req.headers.host}${req.originalUrl}`)
        }
      }
    }

    const db = await getDb()

    /**
     * 根据请求的地址，请求的域名对应的路由信息查出将要执行的路由，并执行
     */
    const location = await pickLocation(db, hostname, pathname)
    await middleware(req, res, hostname, location, {})

  } catch (e) {
    next(e)
  }
}

/**
 * 通过比对pathname, 找到路由
 */
export const pickLocation = (db, hostname, pathname) => new Promise(async(resolve, reject) => {
  try {
    let locations = []
    if (hostname === process.env.API_DOMAIN) {
      locations = internalLocations
    } else {
      const result = await db.collection('domains').findOne({
        domain: hostname,
      }, {
        fields: ['locations']
      })
      locations = body.locations
    }

    const targetLocation = locations.find(item => {
      const re = pathToRegexp(item.pathname)
      const matches = pathname.match(re)
      return matches && matches[0] === pathname
    }) || {
      pathname: '*',
      type: 'FILE'
    }

    resolve(targetLocation)
  } catch (e) {
    const error = new Error('Location not found')
    error.name = 'NotFoundError'
    reject(error)
  }
})
