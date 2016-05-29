import {Router} from 'express'

const _ = require('lodash')
const ent = require('ent')
const async = require('async')
const Location = require('../model/location')
const Host = require('../model/host')

const router = module.exports = Router()


/** 创建一条location记录 **/
router.route('/new').post(function(req, res, next) {

  _.forEach(['host_id', 'type', 'content'], function (item) {
    if (!_.has(req.body, item)) {
      next('LOST_PARAM')
      return false
    }
  })

  Host.findOne({_id: req.body.host_id}, function(err, host){
    if (err) return next('EXCEPTION_ERROR')
    if (!host) return next('NOT_FOUND')
    req.body.type = req.body.type || 'html'
    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

    Location.findOne({host_id: req.body.host_id}).sort({sort: -1}).exec(function (err, doc) {
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
})



/** 获取详情 **/
router.route('/detail').get(function(req, res, next) {

  _.forEach(['host_id', 'locationId'], function (item) {
    if (!_.has(req.query, item)) {
      next('LOST_PARAM')
      return false
    }
  })

  async.parallel([
    function(callback){
      Host.findOne({_id: req.query.host_id}, callback)
    }, function(callback){
      Location.findOne({_id: req.query.locationId}, callback)
    }
  ], function(err, results){
    if (err) return next('EXCEPTION_ERROR')
    return res.json({
      host: results[0],
      location: results[1]
    })

  })
})





/**
 * 更新已有的记录
 * @param req
 * @param res
 */
router.route('/edit').post(function(req, res, next) {

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

})


/**
 * 修改排序
 * @param req
 * @param res
 * @param next
 */
router.route('/update-sort').post(function(req, res, next) {
  _.forEach(['host_id', 'locationId', 'targetSort'], function (item, index) {
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

  Location.find({host_id: req.body.host_id}).exec(function (err, docs) {
    if (err) return next(err)

    Location.findOne({_id: req.body.locationId}).exec(function (err, doc) {
      if (err) return next(err)
      if (!doc) return next('NOT_FOUND')
      if (targetSort == doc.sort) return next('NOT_CHANGED')
      if (targetSort > docs.length) return next('PARAMS_ILLEGAL')

      doc.sort = Number(doc.sort)
      // sort调小,那么在目标sort和当前sort内的记录都要+1, 再把当前sort调到目标sort
      if (targetSort<doc.sort) {
        Location.find({host_id: req.body.host_id, sort: {
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
        Location.find({host_id: req.body.host_id, sort: {
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

})


/**
 * 获取location列表
 */
router.route('/list').get((req, res, next) => {

  if (!_.has(req.query, 'host_id')) return res.json({error: "LOST_PARAM"})

  var result = {}

  req.query.host_id = decodeURIComponent(req.query.host_id)
  console.log(req.query.host_id)

  Host.findOne({_id: req.query.host_id}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item

    Location.find({host_id: req.query.host_id}).sort({sort: 1}).exec(function(err, docs){
      if (err) return res.json({error: 'EXCEPTION_ERROR'})
      result.list = docs
      res.json(result)
    })

  })
})

/**
 * 删除一个location
 */
router.route('/delete').post(function(req, res, next) {
  Location.remove({_id: req.body.locationId}, {}, function(err){
    if (err) return next('EXCEPTION_ERROR')
    res.json({})
  })
})
