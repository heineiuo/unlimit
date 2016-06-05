var _ = require('lodash')
var ent = require('ent')
var conf = require('../conf')


/**
 * 需要安装
 */

module.exports = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}