import fs from 'fs-promise'
import httpProxy from 'http-proxy'

/**
 * 反向代理
 */
const handlePROXY = (req, res, next) => new Promise((resolve, reject) => {

  try {
    const {location} = res.locals;

    const proxy = httpProxy.createProxyServer({
      // protocolRewrite: 'http'
    });

    // todo handle ssl cert to options
    proxy.web(req, res, {
      target: location.content
    });

    proxy.on('error', (err, req, res) => {
      next(err)
    });

    proxy.on('proxyRes', (proxyRes, req, res) => {
      Object.keys(proxyRes.headers).forEach(key => {
        res.set(key, proxyRes.headers[key])
      })
    });

    proxy.close();
    resolve()

  } catch(e){
    reject(e)
  }

});

export default handlePROXY;