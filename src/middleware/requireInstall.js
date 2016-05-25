var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/config')
var Host = require('../model/host')

var main = module.exports = {}




/**
 * 需要安装
 */

module.exports = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}