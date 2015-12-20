/*! server/index.js v0.0.1 2015-12-20 */
var path = require('path')
var crypto = require('crypto')
var fs = require('fs')
var tls = require('tls')
var net = require('net')

// node_modules
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var httpProxy = require('http-proxy')
var request = require('request')
var express = require('express')
var parse = require('url-parse')
var morgan = require('morgan')
var ent = require('ent')
var pem = require('pem')
var _ = require('lodash')

// database
var Datastore = require('nedb')
var db = {}
db.cname = new Datastore({
  filename: path.join(__dirname, './data/cname.db'),
  autoload: true
})
db.host = new Datastore({
  filename: path.join(__dirname, './data/host.db'),
  autoload: true
})

var doc = { hello: 'world'
  , n: 5
  , today: new Date()
  , nedbIsAwesome: true
  , notthere: null
  , notToBeSaved: undefined  // Will not be saved
  , fruits: [ 'apple', 'orange', 'pear' ]
  , infos: { name: 'nedb' }
};

db.host.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
  console.log('222222')

});

console.log('111111')

db.host.insert(doc, function (err, newDoc) {   // Callback is optional
  // newDoc is the newly inserted document, including its _id
  // newDoc has no key called notToBeSaved since its value was undefined
});

var controller = {}
var conf = {}
var app = require('express')()
var http = require('http').Server(app)

;

conf = _.extend(conf, {
  appId: '621b898e-7f9e-4b44-8981-c971998a60ef',
  appSecret: '250af5fa7f6a86a245b161a83c1e0e17',
  appName: "cname-ecs6",
  API_HOST: 'http://127.0.0.1:8888',

  proxy: {
    "api.heineiuo.com": "http://127.0.0.1:8888",
    "api.youkuohao.com": "http://127.0.0.1:8888",
    "static1.heineiuo.com": "http://127.0.0.1:8001"
  },

  //block_host: ['lanmaotv.com', 'www.lanmaotv.com']
  block_host: [],

  ssl: {},
  isStarted: false,

  morgan: {
    format: ':method :status :req[host] :url',
    options: {}
  },

  cnameUpdating: false,
  timeout: 1000*30,
  cnameExpire: Date.now(),
  cname: {list: []},
  isInstalled: false,

  appdata: path.join(__dirname, './appdata'),

})
;
function md5(tobeHash) {
  return crypto.createHash('md5').update(tobeHash).digest('hex')
};
//model('Cname', [
//  ['hostId', String],
//  ['pathname', String, '/^\//'],
//  ['type', String, 'html'], // redirect, html, json, image, api(对应content是接口名称)
//  ['content', String, ''],
//  ['createTime', Date, Date.now]
//]);
//model('Host', [
//  ['hostId', String],
//  ['appId', String],
//  ['userId', String],
//  ['hostname', String],
//  ['sub', String], // 二级域名
//  ['protocol', String, 'http:'],
//]);
controller.requireAdmin = function(req, res, next){

  res.end('aaa')
};
controller.blockCheck = function(req, res, next){

  if (_.indexOf(conf.block_host, req.headers.host) >= 0) {
    res.redirect('http://www.google.com')
    //res.send(500)
  } else {
    next()
  }

};

controller.error500 = function(err, req, res, next){
  if (!err) return next()
  console.log({
    error: "EXCEPTION_ERROR",
    stack: err.stack
  })
  res.sendStatus(500)
}

controller.error404 = function (req, res) {
  res.sendStatus(403)
};
controller.proxyCheck = function(req, res, next){

  if (_.has(conf.proxy, req.headers.host)) {

    // todo handle ssl cert to options
    var options = {
      //protocolRewrite: 'http'
    }

    var target = conf.proxy[req.headers.host]

    httpProxy.createProxyServer(options).web(req, res, {
      target: target
    }, function(err){
      if (err) {
        console.log(err)
        res.status(502)
      }
      res.end()
    })
  } else {
    next()
  }

};
controller.renderApp = function(req, res, next){

  // 获取地址
  var url = parse(req.headers.host + req.url , true)
  // 自动补上'/'
  if(url.pathname =='') url.pathname = '/'

  // 查找路由
  var result = {}
  _.map(conf.cname.list, function(val, key){
    if (val.hostname != url.host) return true
    var reg = new RegExp(_.trim(val.pathname, '/').replace('\\\\','\\'))
    var match = url.pathname.match(reg)
    if (match && match[0] == url.pathname) {
      result = val
      return false
    }
  })

  if (!_.has(result,'type')) return next()
  if (result.type == 'redirect') return res.redirect(result.content)
  if (result.type == 'html') return res.send(ent.decode(result.content))
  if (result.type == 'api') {

    var options = {
      method: 'POST',
      url: conf.API_HOST + result.content,
      qs: req.query,
      form: _.extend(req.body, req.query, {
        appId: conf.appId,
        appSecret: conf.appSecret,
        proxyAppId: result.appId
      })
    }

    request(options, function(err, response, body){
      if (err) return res.send(500)
      try {
        res.json(JSON.parse(body))
      } catch(e){
        console.log(body)
        res.send(502)
      }
    })
  } else {
    next()
  }

};
/**
 * 检查是否需要更新html文件
 * @param req
 * @param res
 * @param next
 * @returns {boolean}
 */
controller.updateCheck = function(req, res, next){

  next()

  if (conf.cnameUpdating) return false
  if (Date.now() < conf.cnameExpire) return false
  conf.cnameUpdating = true

  var options = {
    method: 'POST',
    url: conf.API_HOST+'/service/cname',
    form: {
      appId: conf.appId,
      appSecret: conf.appSecret
    }
  }

  console.log('正在更新....')

  request(options, function(err, data){

    if (err) {
      conf.cnameUpdating = false
      return false
    }

    try {

      var bodyJSON =  JSON.parse(data.body)
      if (bodyJSON.error) {
        return console.log('更新失败：服务器返回错误: '+bodyJSON.error)
      }
      bodyJSON.update_time = new Date()
      conf.cname = bodyJSON
      conf.cnameExpire = Date.now() + conf.timeout

      // 写入文件
      fs.writeFile(conf.appdata+'/cname.json', JSON.stringify(bodyJSON), 'utf-8', function(err){
        if (err) {
          console.log(err)
          console.log('更新失败: 保存cname信息失败')
        }
        conf.cnameUpdating = false
        console.log('更新成功.')
      })

    } catch (e){
      console.log(e)
      console.log('更新失败: 异常')
      conf.cnameUpdating = false
    }

  })

};
var router = require('express').Router()

router.route('/admin').get(controller.requireAdmin);

app.set('x-powered-by', false)

app.use(morgan(conf.morgan.format, conf.morgan.options))

app.use(controller.blockCheck)
app.use(controller.proxyCheck)
app.use(controller.updateCheck)

app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))

app.use(controller.renderApp)
app.use(controller.error500)
app.use(controller.error404)

http.listen(80, function(){
  console.log('Listening on port 80')
})

//pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
//  https.createServer({
//    key: keys.serviceKey,
//    cert: keys.certificate
//  }, app).listen(443)
//})

console.log('Listening on port 443')

