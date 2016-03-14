var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Location = require('../model/Location')
var Config = require('../model/Config')
var Host = require('../model/Host')


var locationController = module.exports = {}



/** 创建一条location记录 **/
locationController.locationCreate = function(req, res) {

  if (!_.has(req.body, 'hostId', 'type', 'content')) return res.json({error: "LOST_PARAM"})

  Host.findOne({_id: req.body.hostId}, function(err, host){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!host) return res.json({error: "NOT_FOUND"})
    req.body.type = req.body.type || 'html'
    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

    Location.insert(req.body, function(err, doc){
      if (err) return res.send({error: "EXCEPTION_ERROR"})
      res.json(doc)
    })
  })

}



/** 获取详情 **/
locationController.detail = function(req, res, next) {

  if (!_.has(req.body, 'hostId', 'locationId')) return res.json({error: "LOST_PARAM"})

  async.parallel([
    function(callback){
      Host.findOne({_id: req.body.hostId}, callback)
    }, function(callback){
      Location.findOne({_id: req.body.locationId}, callback)
    }
  ], function(err, results){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    return res.json({
      host: results[0],
      location: results[1]
    })

  })
}





/**
 * 更新已有的记录
 * @param req
 * @param res
 */
locationController.locationUpdate = function(req, res) {

  if (!_.has(req.body, 'hostId', 'type', 'content', 'pathname')) return res.json({error: "PARAMS_LOST"})
  if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

  req.body.pathname = req.body.pathname.toString()
  Location.update({hostId: req.body.hostId}, req.body, function(err, location){
    if (err) return res.send({error: 'EXCEPTION_ERROR'})
    if (!location) return res.json({error: "NOT_FOUND"})
    res.json(_.omit(location, ['_id', '__v']))
  })

}


/**
 * 获取location列表
 */
locationController.locationListRead = function(req, res, next) {
  Location.find({userId: req.user.userId}, function(err, list){
    if (err) return res.send({error: "EXCEPTION_ERROR"})
    res.json({list: list})
  })
}

/**
 * 删除一个location
 */
locationController.delete = function(req, res, next) {
  Location.remove({_id: req.body.locationId}, {}, function(err){
    if (err) return res.json({error: 'EXCEPTION_ERROR'})
    res.json({})
  })
}