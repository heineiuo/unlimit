var cnameApp = {}

/**
 * 需要安装
 */
cnameApp.requireInstall = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}

/**
 * 需要和安装后的名称一致
 */
cnameApp.requireEqualHost = function(req, res, next) {
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
cnameApp.requireAdmin = function(req, res, next) {
  if (!_.has(req.query, 'token')) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状态
 */
cnameApp.status = function(req, res, next) {
  var result = _.omit(conf, 'password', '_id')
  result = _.extend(result, {
    logged: false
  })
  res.json(result)
}

/**
 * 安装
 */
cnameApp.install = function(req, res, next) {
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
cnameApp.login = function(req, res, next) {
  res.json({})
}


/**
 * 返回app
 * @param req
 * @param res
 * @param next
 */
cnameApp.renderApp = function(req, res, next){

  res.end(JST['home/app']())

}