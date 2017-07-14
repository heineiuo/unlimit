import httpProxy from 'http-proxy'

/**
 * 反向代理
 */

const proxy = httpProxy.createProxyServer({
  // protocolRewrite: 'http'
});

proxy.on('error', (err, req, res) => {
  res.next(err)
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  Object.keys(proxyRes.headers).forEach(key => {
    res.set(key, proxyRes.headers[key])
  })
});


export default (req, res, next) => {
  try {
    const {location} = res.locals;
    if (location.type !== 'PROXY') return next();

    // todo handle ssl cert to options
    proxy.web(req, res, {
      target: location.content
    });
  } catch(e){
    next(e)
  }
};