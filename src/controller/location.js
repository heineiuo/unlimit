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
locationController.locationCreate = function(req, res, next) {

  _.forEach(['hostId', 'type', 'content'], function (item) {
    if (!_.has(req.body, item)) {
      next('LOST_PARAM')
      return false
    }
  })

  Host.findOne({_id: req.body.hostId}, function(err, host){
    if (err) return next('EXCEPTION_ERROR')
    if (!host) return next('NOT_FOUND')
    req.body.type = req.body.type || 'html'
    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

    Location.findOne({hostId: req.body.hostId}).sort({sort: -1}).exec(function (err, doc) {
      if (err) next(err)
      if (!doc) {
        req.body.sort=1
      } else {
        req.body.sort = Number(doc.sort)+1
      }
      Location.insert(req.body, function(err, doc){
        if (err) return next('EXCEPTION_ERROR')
        res.json(doc)
      })
    })
  })
}



/** 获取详情 **/
locationController.detail = function(req, res, next) {

  _.forEach(['hostId', 'locationId'], function (item) {
    if (!_.has(req.body, item)) {
      next('LOST_PARAM')
      return false
    }
  })

  async.parallel([
    function(callback){
      Host.findOne({_id: req.body.hostId}, callback)
    }, function(callback){
      Location.findOne({_id: req.body.locationId}, callback)
    }
  ], function(err, results){
    if (err) return next('EXCEPTION_ERROR')
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
locationController.locationUpdate = function(req, res, next) {

  _.forEach(['type', 'content', 'pathname'], function (item) {
    if (!_.has(req.body, item)) {
      next('LOST_PARAM')
      return false
    }
  })

  if (req.body.type == 'html' && req.body.contentType == 'text') {
    req.body.content = ent.encode(req.body.content)
  }
  req.body.pathname = req.body.pathname.toString()

  Location.update({_id: req.body.locationId}, {$set: {
    type: req.body.type,
    cors: req.body.cors,
    contentType: req.body.contentType,
    content: req.body.content,
    pathname: req.body.pathname
  }}, {}, function(err, numReplaced){
    if (err) return next('EXCEPTION_ERROR')
    if (numReplaced==0) return next('LOCATION_NOT_FOUND')
    res.json({success:1})
  })

}


/**
 * 修改排序
 * @param req
 * @param res
 * @param next
 */
locationController.locationUpdateSort = function(req, res, next) {
  _.forEach(['hostId', 'locationId', 'targetSort'], function (item, index) {
    if (!_.has(req.body, item)) {
      next("PARAMS_LOST")
      return false
    }
  })

  var targetSort = Number(req.body.targetSort)
  if (targetSort < 1) return next('PARAMS_ILLEGAL')

  var updateTargetSort = function (err) {
    if (err) return next(err)
    Location.update({_id: req.body.locationId}, {$set: {
      sort: targetSort
    }}, {}, function (err, doc) {
      if (err) return next(err)
      res.json({})
    })
  }

  Location.find({hostId: req.body.hostId}).exec(function (err, docs) {
    if (err) return next(err)

    Location.findOne({_id: req.body.locationId}).exec(function (err, doc) {
      if (err) return next(err)
      if (!doc) return next('NOT_FOUND')
      if (targetSort == doc.sort) return next('NOT_CHANGED')
      if (targetSort > docs.length) return next('PARAMS_ILLEGAL')

      doc.sort = Number(doc.sort)
      // sort调小,那么在目标sort和当前sort内的记录都要+1, 再把当前sort调到目标sort
      if (targetSort<doc.sort) {
        Location.find({hostId: req.body.hostId, sort: {
          $gte: targetSort,
          $lt: doc.sort
        }}).exec(function (err, docs) {
          if (err) return next(err)
          async.map(docs, function (item, callback) {
            item.sort = Number(item.sort)
            item.sort ++
            Location.update({_id: item._id}, {$set: {sort: item.sort}}, {}, callback)
          }, updateTargetSort)
        })
      } else {
        // 调大, 那么在目标sort和当前sort内的记录都要-1, 再把当前sort调到目标sort
        Location.find({hostId: req.body.hostId, sort: {
          $lte: targetSort,
          $gt: doc.sort
        }}).exec(function (err, docs) {
          if (err) return next(err)
          async.map(docs, function (item, callback) {
            item.sort = Number(item.sort)
            item.sort --
            Location.update({_id: item._id}, {$set: {sort: item.sort}}, {}, callback)
          }, updateTargetSort)
        })
      }

    })

  })

}


/**
 * 获取location列表
 */
locationController.locationListRead = function(req, res, next) {
  Location.find({userId: req.user.userId}, function(err, list){
    if (err) return next('EXCEPTION_ERROR')
    res.json({list: list})
  })
}

/**
 * 删除一个location
 */
locationController.delete = function(req, res, next) {
  Location.remove({_id: req.body.locationId}, {}, function(err){
    if (err) return next('EXCEPTION_ERROR')
    res.json({})
  })
}