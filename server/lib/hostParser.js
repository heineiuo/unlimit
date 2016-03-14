/**
 * hostParser
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var httpProxy = require('http-proxy')
var _ = require('lodash')
var request = require('request')
var parse = require('url-parse')
var ent = require('ent')
var path = require('path')

var conf = require('../conf')
var Location = require('../model/Location')
var Host = require('../model/Host')

var hostParser = module.exports = {}

hostParser.middleware = function () {

  return function (req, res, next) {

    if (!conf.isInstalled) return next()
    if (req.headers.host == conf.hostname) return next()

    // 是否存在host
    Host.findOne({hostname: req.headers.host}, function (err, doc) {

      if (err) {
        console.log('查询是否存在host失败')
        console.log(err)
        return res.sendStatus(500)
      }
      if (!doc) return next()

      // 查找Location
      Location.find({hostId: doc._id}).sort({sort: 1}).exec(function(err, docs) {

        if (err) {
          console.log('查找Location失败')
          console.log(err)
          return res.sendStatus(500)
        }

        if (docs.length == 0) {
          console.log('Location LOG LOST')
          return res.sendStatus(404)
        }

        // 获取url, 自动补上'/'
        var url = parse(req.headers.host + req.url , true)
        if (url.pathname =='') url.pathname = '/'

        // 通过比对pathname, 找到路由
        // todo
        // 需要根据排序执行
        var result = {}
        _.map(docs, function(doc, index){
          var reg = new RegExp(_.trim(doc.pathname, '/').replace('\\\\','\\'))
          var matches = url.pathname.match(reg)
          if (matches && matches[0] == url.pathname) {
            result = doc
            return false
          }
        })


        // 获取到匹配的path

        if (result.type == 'file') {

          var filePath = path.join(result.content, url.pathname)
          res.sendFile(filePath, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Expires': new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 一年
            }
          }, function (err) {
            if (err && !res.headersSent) res.sendStatus(404)
          })

          return false
        }

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

        if (result.type == 'block') {
          return res.redirect('http://www.google.com')
        }
        if (result.type == 'redirect') {
          return res.redirect(result.content)
        }
        if (result.type == 'json') {
          return res.json(JSON.parse(result.content))
        }
        if (result.type == 'html') {
          return res.end(ent.decode(result.content))
        }
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

}


