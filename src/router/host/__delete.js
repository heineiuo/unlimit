
// 获取APP列表
router.route('/app/list').post(
  function(req, res, next) {
    var App = require('../model/App')
    var User = require('../model/User')
    var result = {list: []}
    App.find({}).select('-_id -__v').exec(function(err, list){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      if (!list) return res.json({list: []})
      async.forEachOf(list, function(item, index, callback){
        User.findOne({userId: item.userId}, function(err, doc){
          if (err) return callback(err)
          if (!doc) return callback('USER NOT FOUND')
          list[index] = list[index].toObject()
          list[index].username = doc.username
          callback(null)
        })
      }, function(err){
        if (err) return res.json({error: "EXCEPTION_ERROR", message: err})
        result.list = list
        res.json(result)
      })
    })
  })
// 获取APP列表
router.route('/app/detail').post(
  function(req, res, next) {
    var App = require('../model/App')
    App.findOne({appId: req.body.appId}, function(err, doc){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      if (!doc) return res.json({error: "NOT_FOUND"})
      res.json({app: doc})
    })
  })


// 获取APP列表
router.route('/app/new').post(
  function(req, res, next) {

    var App = require('../model/App')
    App.create(req.body, function(err, app){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      if (!app) return res.json({error: "NOT_FOUND"})
      res.json(req.body)
    })

  }
)

// 获取APP列表
router.route('/app/edit').post(
  function(req, res, next) {
    if (!_.has(req.body, 'appId')) return res.json({error: "PARAMS_LOST"})
    var App = require('../model/App')
    App.findOneAndUpdate({appId: req.body.appId}, req.body, function(err, app){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      if (!app) return res.json({error: "NOT_FOUND"})
      res.json(req.body)
    })
  })



router.route('/app/delete').post(function(req, res, next) {
  if (!_.has(req.body, 'appId')) return res.json({error: "PARAMS_LOST"})
  var App = require('../model/App')
  App.findOneAndRemove({appId: req.body.appId}, function(err, app){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!app) return res.json({error: "NOT_FOUND"})
    res.json({})
  })
})




// html编码
router.route('/encode/html').post(
  function(req, res){

    if (_.has(req.body, 'html')) {
      res.json({result: ent.encode(req.body.html)})
    } else {
      res.json({error: "LOST_PARAMS"})
    }

  }
)


// 字符转数字
router.route('/string2number').post(
  function(req, res){

    if (!_.has(req.body, 'string')) return res.json({error: 'PARAMS_LOST'})

    var string2number = require('../lib/string2number')
    res.json({number: string2number(req.body.string) || 0})

  })