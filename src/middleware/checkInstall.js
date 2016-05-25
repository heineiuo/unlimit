var _ = require('lodash')
var ent = require('ent')
var async = require('async')

var md5  = require('../util/md5')

var Config = require('../model/config')
var Host = require('../model/host')

var main = module.exports = {}




/**
 * 检查程序是否安装成功
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const checkInstall = function(req, res, next){

  if (conf.isChecked) return next()

  Config.findOne({}, function(err, doc){
    conf.isChecked = true
    if (err) {
      console.log('检查是否安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    if (doc) {
      conf.isInstalled = true
      conf = _.extend(conf, doc)
    }
    next()
  })

}



module.exports = checkInstall