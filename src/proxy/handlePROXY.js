import fs from 'fs-promise'
import httpProxy from 'http-proxy'


/**
 * 反向代理
 */
const handlePROXY = async (req, res, next)=>{

  try {
    const {location} = res.locals
    if (location.type != 'PROXY') return next()
    const target = location.content

    // todo handle ssl cert to options
    const proxy = httpProxy.createProxyServer({
      // protocolRewrite: 'http'
    })
    proxy.web(req, res, {
      target: target
    })
    proxy.on('error', function (err, req, res) {
      proxy.close()
      next(err)
    })
    proxy.on('proxyRes', function (proxyRes, req, res) {
      proxy.close()
      Object.keys(proxyRes.headers).forEach(key=>{
        res.set(key, proxyRes.headers[key])
      })
    })
    proxy.on('close', function (res, socket, head) {
      console.log('Client disconnected')
    })
  } catch(e){
    next(e)
  }

}

module.exports = handlePROXY