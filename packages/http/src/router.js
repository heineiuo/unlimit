import Url from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import isIp from 'is-ip'
import { expressJQL } from '@jql/server'
import { proxySeashell, proxyHttp, proxyWs } from './proxy'
import { actions as internalActions, locations as internalLocations } from './internal'

let isInit = false

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
  
    const { HTTPS_FORCE_DOMAINS } = process.env
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
     * 根据请求的地址，请求的域名对应的路由信息查出将要执行的路由，并执行
     */
    const {location, url} = await pickLocation(db, host, req.url)
    Object.assign(res.locals, {
      host, 
      url, 
      location
    })

    // TODO use jql rewrite, do not handle in next middlewales, just in a sandbox

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
export const pickLocation = (db, host, requrl) => new Promise(async(resolve, reject) => {
  try {

    const domainData = {
      locations: []
    }
    
    if (host === process.env.API_DOMAIN) {
      domainData.locations = internalLocations
    } else {
      const result = await db.collection('domains').findOne({
        domain: host,
      }, {
        fields: ['locations']
      })
      domainData.locations = body.locations
    }

    const { locations } = domainData

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
