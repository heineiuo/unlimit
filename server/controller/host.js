var hostController = module.exports = {}
var _ = require('lodash')
var async = require('async')

var conf = require('../conf')
var Host = require('../model/Host')
var Location = require('../model/Location')
var Config = require('../model/Config')


/** 创建一条host记录 **/
hostController.new = function(req, res, next) {

  if (!_.has(req.body, 'hostname')) return res.json({error: "LOST_PARAM"})
  if (_.trim(req.body.hostname) == '') return res.json({error: "ILLEGAL_PARAM"})

  Host.findOne({hostname: req.body.hostname}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (item) return res.json({error: "PERMISSION_DENIED", message: "域名已存在"})

    Host.insert({
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

  if (!_.has(req.body, 'hostId')) return res.json({error: "LOST_PARAM"})

  var result = {}

  Host.findOne({_id: req.body.hostId}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item

    Location.find({hostId: req.body.hostId}, function(err, docs){
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
      return Host.remove({_id: req.body.hostId}, {}, callback)
    }, function(callback){
      return Location.remove({hostId: req.body.hostId}, {multi: true}, callback)
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

  Host.find({}, function(err, docs){
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
  throw 'API_BUILDING'
}