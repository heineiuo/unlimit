import fs from 'fs-promise'
import httpProxy from 'http-proxy'


/**
 * 反向代理
 */
const handlePROXY = async (req, res, next)=>{

  try {
    const {location} = res.locals
    if (location.type != 'PROXY') return next()

    console.log('proxy...')

    const proxy = httpProxy.createProxyServer({
      // protocolRewrite: 'http'
    })

    // todo handle ssl cert to options
    proxy.web(req, res, {
      target: location.content
    })

    proxy.on('error', function (err, req, res) {
      next(err)
    })

    proxy.on('proxyRes', function (proxyRes, req, res) {
      Object.keys(proxyRes.headers).forEach(key=>{
        res.set(key, proxyRes.headers[key])
      })
    })

    proxy.close()


  } catch(e){
    next(e)
  }

}

module.exports = handlePROXY