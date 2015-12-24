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
  if (!_.has(req.locals, 'admin')) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状
 */
cnameApp.status = function(req, res, next) {
  res.json(conf)
}

/**
 * 安装
 */
cnameApp.install = function(req, res, next) {
  if (conf.isInstalled) return res.sendStatus(403)

  // TODO install
  res.sendStatus(500)

}



/**
 * 登录
 */
cnameApp.login = function(req, res, next) {
  res.json({})
}





cnameApp.renderApp = function(req, res, next){

  res.end('cname app')

}