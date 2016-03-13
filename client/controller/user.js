var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))
var cookie = require('../lib/cookie')

var user = module.exports = {}

user.getStatus = function(req, res, next){

  var cookieSession = cookie('__session').val()
  req.serverStatus = JSON.parse(cookieSession) || null
  if (req.serverStatus) return next()

  ajax('serverStatus').exec(function(err, result){
    if (err) {
      cookie('__session').remove()
      return next(err)
    }
    req.serverStatus = _.extend(conf, result)
    cookie('__session').val(JSON.stringify(req.serverStatus))
    next()
  })

}

user.requireLogin = function(req, res, next){

  if (req.serverStatus.logged) return next()
  cookie('password').remove()
  res.redirect('/login')

}