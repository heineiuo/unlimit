import httpProxy from 'http-proxy'

/**
 * 反向代理
 */
export const proxyHttp = query => (dispatch, getState) => new Promise((resolve, reject) => {
  try {
    const { request: req, response: res} = getState()
    const { location } = res.locals

    const proxy = httpProxy.createProxyServer({
      // protocolRewrite: 'http'
    })

    // todo handle ssl cert to options
    proxy.web(req, res, {
      target: location.content
    })

    proxy.on('error', (err, req, res) => {
      reject(err)
    })

    proxy.on('proxyRes', (proxyRes, req, res) => {
      Object.keys(proxyRes.headers).forEach(key => {
        res.set(key, proxyRes.headers[key])
      })
    })
  } catch(e){
    reject(e)
  }
})

export const proxyWs = (query) => (dispatch, getState) => new Promise((resolve, reject) => {

})
