var _ = require('lodash')
var async = require('async')

var Host = require('../model/host')
var Location = require('../model/location')
var Config = require('../model/config')

var express = require('express')
var router = module.exports = express.Router()


// router.use(main.requireInstall)
// router.use(main.requireEqualHost)
// router.use(main.requireAdmin)

/************************
 *
 * domain和location
 *
 ************************/

// 获取域名列表
router.route('/api/host/list').post((req, res, next)=> {

  Host.find({}, function(err, docs){
    if(err) return res.json({error: 'EXCEPTION_ERROR'})
    res.json({list: docs})
  })

})

// 获取域名详情
router.route('/api/host/detail').post((req, res, next) => {

  if (!_.has(req.body, 'hostId')) return res.json({error: "LOST_PARAM"})

  var result = {}

  Host.findOne({_id: req.body.hostId}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item

    Location.find({hostId: req.body.hostId}).sort({sort: 1}).exec(function(err, docs){
      if (err) return res.json({error: 'EXCEPTION_ERROR'})
      result.list = docs
      res.json(result)
    })

  })

})

// 创建新的域名
router.route('/api/host/new').post((req, res, next) => {

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

})

// 编辑域名
router.route('/api/host/edit').post(function (req, res, next) {
  next('API_BUILDING')
})


// 删除域名
router.route('/api/host/delete').post(function(req, res, next) {

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

})
