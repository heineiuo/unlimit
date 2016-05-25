var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/Config')
var Host = require('../model/Host')

var main = module.exports = {}




/**
 * 需要登录
 */
const requireAdmin = function(req, res, next) {
  var access_token = req.query.access_token || req.body.access_token
  if (!access_token) return res.json({error: 'PERMISSION_DENIED'})
  if (conf.access_token != access_token) return res.json({error: 'PERMISSION_DENIED'})
  next()
}

export default requireAdmin