var hostController = module.exports = {}
var conf = require('../conf')
var db = require('../model/db')
var _ = require('lodash')
var async = require('async')

/** 创建一条host记录 **/
hostController.new = function(req, res, next) {


  if (!_.has(req.body, 'hostname')) {
    return res.json({error: "LOST_PARAM"})
  }

  if (_.trim(req.body.hostname) == '') {
    return res.json({error: "ILLEGAL_PARAM"})
  }

  db.host.findOne({hostname: req.body.hostname}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (item) return res.json({error: "PERMISSION_DENIED", message: "域名已存在"})

    db.host.insert({
      hostname: req.body.hostname
    }, function(err, item){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      res.json(item)
    })


  })

}




/**
 * 获取域名详
 */
hostController.detail = function(req, res, next) {

  if (!_.has(req.body, 'hostId')) {
    return res.json({error: "LOST_PARAM"})
  }

  var result = {}

  db.host.findOne({_id: req.body.hostId}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item

    db.cname.find({hostId: req.body.hostId}, function(err, docs){
      if (err) return res.json({error: 'EXCEPTION_ERROR'})
      result.list = docs
      res.json(result)
    })

  })

}



/**
 * 删除某个域名
 */
hostController.delete = function(req, res, next) {

  if (!_.has(req.body, 'hostId')) return res.json({error: "PERMISSION_DENIED"})

  async.parallel([
    function(callback){
      return db.host.remove({_id: req.body.hostId}, {}, callback)
    }, function(callback){
      return db.cname.remove({hostId: req.body.hostId}, {multi: true}, callback)
    }
  ], function(err, result){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    return res.json({result: result})
  })

}

/**
 * 获取域名列表
 */
hostController.list = function(req, res, next) {

  //var Host = model('Host')
  //
  //Host.find({userId: req.user.userId}, function(err, list){
  //  if (err) return res.json({error: "EXCEPTION_ERROR"})
  //  res.json({list: list})
  //})

  db.host.find({}, function(err, docs){
    if(err) return res.json({error: 'EXCEPTION_ERROR'})
    res.json({list: docs})
  })

}

/**
 * 编辑host
 * @param req
 * @param ers
 * @param next
 */
hostController.edit = function (req, res, next) {
  res.json({error: "API_BUILDING"})
}