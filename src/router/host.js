var _ = require('lodash')
var async = require('async')

var Host = require('../model/host')
var Location = require('../model/location')

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
router.route('/list').get( async(req, res, next)=> {

  try {
    Host.find({}, function(err, docs){
      if(err) throw err
      res.json({list: docs})
    })
  } catch(e){
    next(e)
  }


})

// 获取域名详情
router.route('/detail').get((req, res, next) => {

  if (!_.has(req.body, 'hostId')) return res.json({error: "LOST_PARAM"})

  var result = {}

  Host.findOne({_id: req.body.hostId}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item
    res.json(result)

  })

})

// 创建新的域名
router.route('/new').post((req, res, next) => {

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
router.route('/edit').post(function (req, res, next) {
  next('API_BUILDING')
})


// 删除域名
router.route('/delete').post(function(req, res, next) {

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
