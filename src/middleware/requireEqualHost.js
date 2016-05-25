var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/Config')
var Host = require('../model/Host')

var main = module.exports = {}



/**
 * 需要和安装后的名称一致
 */


const requireEqualHost = function(req, res, next) {
  // 未安装的,直接通过
  if (!conf.isInstalled) return next()
  // 已安装的,检查是否一致
  var hostNameReg = /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/
  if (hostNameReg.test(req.hostname)) return next()
  if (_.indexOf(conf.hostnames, req.hostname) < 0) return res.sendStatus(404)
  next()
}

export default requireEqualHost