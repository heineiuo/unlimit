var _ = require('lodash')
var ent = require('ent')
var Config = require('../model/config')
var Host = require('../model/host')
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