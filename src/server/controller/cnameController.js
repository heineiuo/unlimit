var cnameController = {}

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
  return next()

  // 未安装的,直接通过
  if (!conf.isInstalled) return next()
  // 已安装的,检查是否一致
  if (req.hostname !== conf.hostname) return res.json({error: 'UNEQUAL_HOSTNAME'})
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
    if (err) return res.sendStatus(500)
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

  res.end(JST['home/app']())

}


/** 创建一条cname记录 **/
cnameController.cnameCreate = function(req, res) {
  var App = model('App')
  var User = model('User')
  var Host = model('Host')
  var Cname = model('Cname')

  if (!_.has(req.body, 'hostId', 'hostname', 'content')) {
    return res.json({error: "LOST_PARAM"})
  }

  Host.findOne({hostId: req.body.hostId}, function(err, host){
    if (err) return res.json({error: "EXCEPTION_ERROR"})
    if (!host) return res.json({error: "NOT_FOUND"})
    req.body.appId = host.appId
    req.body.type = req.body.type || 'html'
    req.body.userId = req.user.userId
    if (req.body.type = 'html') req.body.content = ent.encode(req.body.content)

    Cname.create(req.body, function(err, cname){

      if (err) return res.send({error: "EXCEPTION_ERROR"})
      res.json(_.omit(cname.toObject(), ['_id', '__v']))

    })
  })

}




/** 获取详情 **/
cnameController.cnameReadByUrl = function(req, res, next) {
  var App = model('App')
  var User = model('User')
  var Cname = model('Cname')

  if (!_.has(req.query, 'url')) {
    return res.json({error: "LOST_PARAM", error_msg: 404})
  }

  var url = parse(req.query.url , true)

  if(url.pathname =='') {
    url.pathname = '/'
  }

  Cname.find({host: url.host}, function(err, list){

    if (err) {
      return res.json(500)
    }

    var result = {error: 'NOT_FOUND', error_msg: 404, url: url}

    _.each(list, function(val, key){

      var reg = new RegExp(_.trim(val.pathname, '/').replace('\\\\','\\'))
      var match = url.pathname.match(reg)
      if (match && match[0] == url.pathname) {
        result = _.pick(val, ['redirect', 'content'])

        if (!result.redirect) {
          result.content = ent.decode(result.content)
        }

        return false
      }
    })

    res.json(result)

  })

}





/**
 * 更新已有的记录
 * @param req
 * @param res
 */
cnameController.cnameUpdate = function(req, res) {
  var App = model('App')
  var User = model('User')
  var Cname = model('Cname')

  if (!_.has(req.body, 'hostId', 'type', 'content', 'pathname')) return res.json({error: "PARAMS_LOST"})

  if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)
  req.body.pathname = req.body.pathname.toString()

  Cname.findOneAndUpdate({hostId: req.body.hostId}, req.body, function(err, cname){

    if (err) return res.send({error: 'EXCEPTION_ERROR'})
    if (!cname) return res.json({error: "NOT_FOUND"})

    res.json(_.omit(cname.toObject(), ['_id', '__v']))

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

  db.cname.remove({cnameId: req.body.cnameId}, function(err){
    if (err) return res.json({error: 'EXCEPTION_ERROR'})
    res.json({})
  })

}