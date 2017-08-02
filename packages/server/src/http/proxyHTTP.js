import httpProxy from 'http-proxy'

/**
 * 反向代理
 */



export default (req, res, next) => {
  try {
    const {location} = res.locals;
    if (location.type !== 'PROXY') return next();

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
    
  } catch(e){
    next(e)
  }
};
