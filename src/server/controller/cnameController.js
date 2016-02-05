var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var db = require('../model/db')

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
  if (_.indexOf(conf.hostnames, req.hostname) < 0) {
    return res.sendStatus(404)
  }
  next()
}

/**
 * 需要登录
 */
cnameController.requireAdmin = function(req, res, next) {
  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
  if (conf.password != req.body.password) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状态
 */
cnameController.status = function(req, res, next) {
  var result = _.omit(conf, 'password', '_id')
  result.logged = false
  if (req.body.password == conf.password) {
    result = _.extend(result, {
      logged: true
    })
  }
  res.json(result)
}

/**
 * 安装
 */
cnameController.install = function(req, res, next) {
  if (conf.isInstalled) return res.sendStatus(403)
  db.config.insert(req.body, function(err, doc){
    if (err) {
      console.log('安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    conf = _.extend(conf, doc)
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

  var result = _.omit(conf, 'password', '_id')
  res.json(result)

}


/**
 * 返回app
 * @param req
 * @param res
 * @param next
 */
cnameController.renderApp = function(req, res, next){

  res.sendFile(appEntry('home'))

  function appEntry(name){
    return process.cwd() + '/public/assets/'+name+'/index.html'
  }
}


/** 创建一条cname记录 **/
cnameController.cnameCreate = function(req, res) {


  if (!_.has(req.body, 'hostId', 'type', 'content')) {
    return res.json({error: "LOST_PARAM"})
  }

  db.host.findOne({_id: req.body.hostId}, function(err, host){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!host) return res.json({error: "NOT_FOUND"})
    req.body.type = req.body.type || 'html'
    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

    db.cname.insert(req.body, function(err, doc){
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
      db.host.findOne({_id: req.body.hostId}, callback)
    }, function(callback){
      db.cname.findOne({_id: req.body.cnameId}, callback)
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

  var Cname = db.cname

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