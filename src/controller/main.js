var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/Config')
var Host = require('../model/Host')

var main = module.exports = {}

/**
 * 需要安装
 */
main.requireInstall = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}

/**
 * 需要和安装后的名称一致
 */
main.requireEqualHost = function(req, res, next) {
  // 未安装的,直接通过
  if (!conf.isInstalled) return next()
  // 已安装的,检查是否一致
  var hostNameReg = /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/
  if (hostNameReg.test(req.hostname)) return next()
  if (_.indexOf(conf.hostnames, req.hostname) < 0) return res.sendStatus(404)
  next()
}

/**
 * 需要登录
 */
main.requireAdmin = function(req, res, next) {
  var access_token = req.query.access_token || req.body.access_token
  if (!access_token) return res.json({error: 'PERMISSION_DENIED'})
  if (conf.access_token != access_token) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状态
 */
main.status = function(req, res, next) {
  var result = _.omit(conf, ['password', '_id'])
  result.logged = false
  if (req.body.access_token == conf.access_token) {
    result = _.extend(result, {
      logged: true
    })
  }
  res.json(result)
}



/**
 * 检查程序是否安装成功
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
main.checkInstall = function(req, res, next){

  if (conf.isChecked) return next()

  Config.findOne({}, function(err, doc){
    conf.isChecked = true
    if (err) {
      console.log('检查是否安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    if (doc) {
      conf.isInstalled = true
      conf = _.extend(conf, doc)
    }
    next()
  })

}

/**
 * 安装
 */
main.install = function(req, res, next) {
  if (conf.isInstalled) return res.sendStatus(403)
  var options = _.omit(req.body, ['access_token', 'debug'])
  options.access_token = md5('location'+Date.now())
  Config.insert(options, function(err, doc){
    if (err) {
      console.log('安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    conf = _.extend(conf, doc)
    conf.access_token = doc.access_token
    conf.isInstalled = true
    res.json({})
  })

}



/**
 * 登录
 */
main.login = function(req, res, next) {

  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
  if (req.body.password != conf.password) return res.json({error: 'PERMISSION_DENIED'})

  var result = _.omit(conf, 'password')
  res.json(result)

}

