var httpProxy = require('http-proxy')
var path = require('path')
var conf = require(path.join('../conf'))

var proxy = module.exports = {}


proxy.check = function(req, res, next){

  if (req.headers.host in conf.proxyHosts) {
    httpProxy.createProxy().web(req, res, {
      target: conf.proxyHosts[req.headers.host]
    }, function(err){
      if (err) {
        res.status(502)
        res.end()
      }
    })
  } else {
    next()
  }

}