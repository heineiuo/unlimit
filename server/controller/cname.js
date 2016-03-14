var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Cname = require('../model/Cname')
var Config = require('../model/Config')
var Host = require('../model/Host')


var cnameController = module.exports = {}

/**
 * 需要安装
 */
cnameController.requireInstall = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}

/**
 * 需要和安装后的名称一致
 */
cnameController.requireEqualHost = function(req, res, next) {

  // 未安装的,直接通过
  if (!conf.isInstalled) return next()
  // 已安装的,检查是否一致
  if (/^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/.test(req.hostname)) {
    return next()
  }
  if (_.indexOf(conf.hostnames, req.hostname) < 0) {
    return res.sendStatus(404)
  }
  next()
}

/**
 * 需要登录
 */
cnameController.requireAdmin = function(req, res, next) {
  var cname_token = req.query.cname_token || req.body.cname_token
  if (!cname_token) return res.json({error: 'PERMISSION_DENIED'})
  if (conf.cname_token != cname_token) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状态
 */
cnameController.status = function(req, res, next) {
  var result = _.omit(conf, ['password', '_id'])
  result.logged = false
  if (req.body.cname_token == conf.cname_token) {
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
cnameController.checkInstall = function(req, res, next){

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
cnameController.install = function(req, res, next) {
  if (conf.isInstalled) return res.sendStatus(403)
  var options = _.omit(req.body, ['cname_token', 'debug'])
  options.cname_token = md5('cname'+Date.now())
  Config.insert(options, function(err, doc){
    if (err) {
      console.log('安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    conf = _.extend(conf, doc)
    conf.cname_token = doc.cname_token
    conf.isInstalled = true
    res.json({})
  })

}



/**
 * 登录
 */
cnameController.login = function(req, res, next) {

  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
  if (req.body.password != conf.password) return res.json({error: 'PERMISSION_DENIED'})

  var result = _.omit(conf, 'password')
  res.json(result)

}




/** 创建一条cname记录 **/
cnameController.cnameCreate = function(req, res) {

  if (!_.has(req.body, 'hostId', 'type', 'content')) return res.json({error: "LOST_PARAM"})

  Host.findOne({_id: req.body.hostId}, function(err, host){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!host) return res.json({error: "NOT_FOUND"})
    req.body.type = req.body.type || 'html'
    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

    Cname.insert(req.body, function(err, doc){
      if (err) return res.send({error: "EXCEPTION_ERROR"})
      res.json(doc)
    })
  })

}



/** 获取详情 **/
cnameController.detail = function(req, res, next) {

  if (!_.has(req.body, 'hostId', 'cnameId')) return res.json({error: "LOST_PARAM"})

  async.parallel([
    function(callback){
      Host.findOne({_id: req.body.hostId}, callback)
    }, function(callback){
      Cname.findOne({_id: req.body.cnameId}, callback)
    }
  ], function(err, results){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    return res.json({
      host: results[0],
      cname: results[1]
    })

  })
}





/**
 * 更新已有的记录
 * @param req
 * @param res
 */
cnameController.cnameUpdate = function(req, res) {


  if (!_.has(req.body, 'hostId', 'type', 'content', 'pathname')) return res.json({error: "PARAMS_LOST"})

  if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)
  req.body.pathname = req.body.pathname.toString()

  Cname.update({hostId: req.body.hostId}, req.body, function(err, cname){

    if (err) return res.send({error: 'EXCEPTION_ERROR'})
    if (!cname) return res.json({error: "NOT_FOUND"})

    res.json(_.omit(cname, ['_id', '__v']))

  })


}


/**
 * 获取cname列表
 */
cnameController.cnameListRead = function(req, res, next) {
  var App = model('App')
  var User = model('User')
  var Cname = model('Cname')

  Cname.find({userId: req.user.userId}, function(err, list){
    if (err) return res.send({error: "EXCEPTION_ERROR"})
    res.json({list: list})
  })

}

/**
 * 删除一个cname
 */
cnameController.delete = function(req, res, next) {

  db.cname.remove({_id: req.body.cnameId}, {}, function(err){
    if (err) return res.json({error: 'EXCEPTION_ERROR'})
    res.json({})
  })

}