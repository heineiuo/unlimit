var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))
var cookie = require('../lib/cookie')

var user = module.exports = {}

user.getStatus = function(req, res, next){
  ajax('serverStatus').exec(function(err, result){
    if (err) return $('#container').html(err)
    req.serverStatus = _.extend(conf, result)
    next()
  })
}

user.requireLogin = function(req, res, next){

  if (!cookie('password').val()) return res.redirect('/login')
  if (req.serverStatus.logged) return next()
  res.redirect('/login')

}