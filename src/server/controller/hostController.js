var hostController = {}


/** 创建一条host记录 **/
hostController.new = function(req, res, next) {
  var App = model('App')
  var Host = model('Host')

  if (!_.has(req.body, 'appId', 'hostname')) {
    return res.json({error: "LOST_PARAM"})
  }

  Host.findOne({hostname: req.body.hostname}, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (item) return res.json({error: "PERMISSION_DENID", message: "域名已存在"})

    App.findOne({appId: req.body.appId, userId: req.user.userId}, function(err, appItem){
      if (err) return res.json({error: "EXCEPTION_ERROR"})
      if (!appItem) return res.json({error: "NOT_FOUND", message: "app不存在"})

      Host.create({
        hostId: uuid(),
        userId: req.user.userId,
        appId: req.body.appId,
        hostname: req.body.hostname
      }, function(err, item){
        if (err) return res.json({error: "EXCEPTION_ERROR"})
        res.json(_.omit(item.toObject(),'__v', '_id'))
      })

    })
  })

}




/**
 * 获取域名详
 */
hostController.detail = function(req, res, next) {
  var Host = model('Host')

  if (!_.has(req.body, 'hostId')) {
    return res.json({error: "LOST_PARAM", error_msg: 404})
  }

  Host.findOne({
    hostId: req.body.hostId,
    userId: req.user.userId
  }, function(err, item){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!item) return res.json({error: "NOT_FOUND"})
    if (item.userId != req.user.userId) return res.json({error: "PERMISSION_DENIED"})
    res.json(item)
  })

}



/**
 * 删除某个域名
 */
hostController.delete = function(req, res, next) {
  var Host = model('Host')
  Host.findOneAndRemove({hostId: hostId}, function(err){
    if (err) return res.json({error: "EXCEPTION"})
    res.json({})
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