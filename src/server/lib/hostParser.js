/**
 * hostParser
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var hostParser = module.exports = {}
var httpProxy = require('http-proxy')
var _ = require('lodash')
var request = require('request')
var conf = require('../conf')
var db = require('../model/db')
var parse = require('url-parse')
var ent = require('ent')

hostParser.parse = function(req, res, next) {

  if (!conf.isInstalled) return next()
  if (req.headers.host == conf.hostname) return next()

  // 是否存在host
  db.host.findOne({hostname: req.headers.host}, function (err, doc) {

    if (err) {
      console.log('查询是否存在host失败')
      console.log(err)
      return res.sendStatus(500)
    }
    if (!doc) {
      //console.log('DOMAIN NOT FOUND')
      //return res.sendStatus(404)
      return next()
    }

    // 查找cname
    db.cname.find({hostId: doc._id}, function(err, docs) {

      if (err) {
        console.log('查找cname失败')
        console.log(err)
        return res.sendStatus(500)
      }

      if (docs.length == 0) {
        console.log('CNAME LOG LOST')
        return res.sendStatus(404)
      }

      // 获取url, 自动补上'/'
      var url = parse(req.headers.host + req.url , true)
      if (url.pathname =='') url.pathname = '/'

      // 通过比对pathname, 找到路由
      var result = {}
      _.map(docs, function(doc, index){
        var reg = new RegExp(_.trim(doc.pathname, '/').replace('\\\\','\\'))
        var matches = url.pathname.match(reg)
        if (matches && matches[0] == url.pathname) {
          result = doc
          return false
        }
      })

      if (result.type == 'proxy') {
        // todo handle ssl cert to options
        var options = {
          // protocolRewrite: 'http'
        }
        var target = result.content
        httpProxy.createProxyServer(options).web(req, res, {
          target: target
        }, function (err) {
          if (err) {
            console.log(err)
            return res.sendStatus(502)
          }
          res.end()
        })
        return false
      }

      if (result.type == 'block') return res.redirect('http://www.google.com')
      if (result.type == 'redirect') return res.redirect(result.content)
      if (result.type == 'html') return res.end(ent.decode(result.content))
      if (result.type == 'api') {

        var apiOptions = {
          method: 'POST',
          url: result.content,
          qs: req.query,
          form: _.extend(req.body, req.query, {
            appId: conf.appId,
            appSecret: conf.appSecret,
            proxyAppId: result.appId
          })
        }

        request(apiOptions, function(err, response, body){
          if (err) {
            console.log('请求外部接口失败')
            console.log(err)
            return res.sendStatus(500)
          }
          try {
            res.json(JSON.parse(body))
          } catch(e){
            console.log(body)
            res.sendStatus(502)
          }
        })

        return false
      }

      return res.sendStatus(404)


    })

  })


}



/**
 * 检查程序是否安装成功
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
hostParser.checkInstall = function(req, res, next){

  if (conf.isChecked) return next()

  db.config.findOne({}, function(err, doc){
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