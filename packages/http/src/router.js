import { URL } from "url"
import UAParser from "ua-parser-js"
import pathToRegexp from "path-to-regexp"
import isIp from 'is-ip'
import isPlainObject from 'lodash/isPlainObject'
import { match, when } from 'match-when'

const noop = () => {}

/**
 * 查找host及其location列表
 */
class VMRouter {

  constructor(options={}){
    this._forceHttpsDomains = options.forceHttpsDomains || []
    this._apiDomain = options.apiDomain || 'localhost'
    this._jqlParamKey = options.jqlParamKey || '__fn'
    this.routes = {}
  }

  _options = {}
  _middlewares = {}

  /**
   * 通过比对pathname, 找到路由
   */
  pickLocation = (locations, pathname) => {
    return locations.find(item => {
      const re = pathToRegexp(item.pathname)
      const matches = pathname.match(re)
      return matches && matches[0] === pathname
    })
  }

  intergrate = (domain, locations, container) => {
    this.routes[domain] = {
      locations, 
      container
    }
  }

  replaceLocations = (doamin, nextLocations) => {
    this.routes[domain].locations = nextLocations
  }

  express = async (req, res, next) => {
    try {
      const fullUrl = `${req.protocol}://${req.headers.host}${req.originalUrl}`
      const { hostname, pathname } = new URL(fullUrl)
      
      if (isIp(hostname)) {
        res.status(403)
        return res.json({
          error: 'ForbiddenError',
          message: 'Cound not access by ip address'
        })
      }

      if (this._forceHttpsDomains.indexOf(hostname) > -1) {
        if (req.protocol === 'http') {
          const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser()
          if (browser.name !== 'IE' || (browser.name === 'IE' && Number(browser.major) >= 9)) {
            return res.redirect(`https://${req.headers.host}${req.originalUrl}`)
          } else {
            return res.end(`Your browser doesn't support HTTPS protocol, please use another browser.`)
          }
        }
      }

      if (!this.routes.hasOwnProperty(hostname)){
        const error = new Error('Not found')
        error.name = 'NotFoundError'
        return next(error)
      }

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

      const { container, locations } = this.routes[hostname]
  
      /**
       * 根据请求的地址，请求的域名对应的路由信息查出将要执行的路由，并执行
       */
      const location = this.pickLocation(locations, pathname)
      if (!location) {
        const error = new Error('Not found')
        error.name = 'NotFoundError'
        return next(error)
      }
      const params = Object.assign({}, req.query, req.body)
      const script = match(location.type, {
        [when('JQL')]: () => {
          if (!params[this._jqlParamKey]) {
            res.status(403)
            const error = new Error('Params illegal')
            error.name = 'ForbiddenError'
            return next(error)
          }
          return params[this._jqlParamKey]
        },
        [when()]: () => `(${location.function})`
      })
      const result = await container.exec(script, {
        params,
        request: req,
        response: res
      })
      if (!res.headersSent) {
        if (isPlainObject(result)) {
          res.json(result)
        } else if (typeof result === 'number') {
          res.json(result)
        } else if (typeof result === 'string') {
          res.json(result)
        } else if (typeof result === 'undefined') {
          res.json(result)
        } else {
          res.json(result)
        }
      }
    } catch (e) {
      next(e)
    }
  }
}

export default (options) => new VMRouter(options)
