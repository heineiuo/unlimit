var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/Config')
var Host = require('../model/Host')

var main = module.exports = {}




/**
 * 登录
 */
const login = function(req, res, next) {

  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
  if (req.body.password != conf.password) return res.json({error: 'PERMISSION_DENIED'})

  var result = _.omit(conf, 'password')
  res.json(result)

}

export default login