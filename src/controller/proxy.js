var controller = controller  || purple.Controller()

controller('proxy.check', function(req, res, next){

  if (_.has(conf.proxy, req.headers.host)) {

    // todo handle ssl cert to options
    var options = {
      //protocolRewrite: 'http'
    }

    var target = conf.proxy[req.headers.host]

    httpProxy.createProxyServer(options).web(req, res, {
      target: target
    }, function(err){
      if (err) {
        console.log(err)
        res.status(502)
      }
      res.end()
    })
  } else {
    next()
  }

})