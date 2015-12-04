var controller = controller  || purple.Controller()

controller('block.check', function(req, res, next){

  if (_.indexOf(conf.block_host, req.headers.host) >= 0) {
    res.redirect('http://www.google.com')
    //res.send(500)
  } else {
    next()
  }

})