import {Router} from "express"
import bodyParser from "body-parser"
import pick from "lodash/pick"
import httpProxy from 'http-proxy'

const INSTANCE_META = {
  version: '0.0.1',
  instance_start_time: Date.now()
}

export const proxySeashell = (getSeashell) => {

  const router = Router()

  router.use((req, res, next) => {
    const {location} = res.locals
    if (location.type === 'SEASHELL') return next()
    return next('NOT_IN_SEASHELL')
  })

  router.use(bodyParser.urlencoded({extended: true}))
  router.use(bodyParser.json())
  router.use(bodyParser.json({type: 'application/*+json'}))
  router.use(bodyParser.json({type: 'text/html'}))
  router.use(bodyParser.json({type: 'text/plain'}))

  router.use(async (req, res, next) => {

    try {
      const seashell = await getSeashell()
      const {host, url, location} = res.locals
      const __GATEWAY_META = Object.assign({},
        pick(req, ['ip', 'method', 'originalUrl', 'protocol']),
        pick(req.headers, ['user-agent', 'host'])
      )

      const data = Object.assign({}, req.query, req.body)

      const content = location.content
      let requestUrl = url.pathname.substring(content.length)

      if (requestUrl === '/') requestUrl = '/' + seashell.__SEASHELL_NAME
      console.log(requestUrl)
        // Object.assign(res.locals.location, {type: 'JSON', content: INSTANCE_META})
        // return next()
      // }

      let result = {body: {}}
      if (requestUrl.search(seashell.__SEASHELL_NAME) === 0) {
        const originUrl = requestUrl.substring(seashell.__SEASHELL_NAME.length)
        let session = null
        try {
          session = await seashell.requestSession({
            headers: {
              __GATEWAY_META,
              'switch-identity': {
                appName: 'user',
                appSecret: data.token
              }
            }
          })
        } catch (e) {
        }

        delete data.token

        result = await seashell.requestSelf({
          headers: {
            __GATEWAY_META,
            originUrl,
            session
          },
          body: data
        })
      } else {
        result = await seashell.requestChild(requestUrl, data, {
          headers: {
            __GATEWAY_META,
            'switch-identity': {
              appName: 'user',
              appSecret: data.token
            }
          }
        })
      }

      if (result.body.error === 'TARGET_SERVICE_OFFLINE') res.status(404)

      if (result.headers.hasOwnProperty('__HTML')) {
        Object.assign(res.locals.location, {type: 'HTML', content: result.body.html})
      } else if (result.headers.hasOwnProperty('__UPLOAD')) {
        Object.assign(res.locals.location, {type: 'UPLOAD', content: result.body})
      } else {
        Object.assign(res.locals.location, {type: 'JSON', content: result.body})
      }

      next()
    } catch (e) {
      next(e)
    }

  })

  router.use((err, req, res, next) => {
    if (err === 'NOT_IN_SEASHELL') return next()
    next(err)
  })

  return router

}


/**
 * 反向代理
 */
export const proxyHttp = (req, res, next) => {
  try {
    const {location} = res.locals
    if (location.type !== 'PROXY') return next()

    const proxy = httpProxy.createProxyServer({
      // protocolRewrite: 'http'
    })

    // todo handle ssl cert to options
    proxy.web(req, res, {
      target: location.content
    })

    proxy.on('error', (err, req, res) => {
      next(err)
    })

    proxy.on('proxyRes', (proxyRes, req, res) => {
      Object.keys(proxyRes.headers).forEach(key => {
        res.set(key, proxyRes.headers[key])
      })
    })
    
  } catch(e){
    next(e)
  }
}

export const proxyWs = (req, res, next) => {
  
}
