var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var conf = require('../conf')
var md5  = require('../lib/md5')

var Config = require('../model/Config')
var Host = require('../model/Host')

var main = module.exports = {}






/**
 * 获取状态
 */
const status = function(req, res, next) {
  var result = _.omit(conf, ['password', '_id'])
  result.logged = false
  if (req.body.access_token == conf.access_token) {
    result = _.extend(result, {
      logged: true
    })
  }
  res.json(result)
}

export default status