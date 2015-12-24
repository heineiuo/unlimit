/*! server/index.js v0.0.1 2015-12-25 */

// built-in modules
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
var Datastore = require('nedb')
var app = require('express')()
var router = require('express').Router()
var http = require('http').Server(app)
;

var conf = {
  /**
   * 日志输出格式
   */
  morgan: {
    format: ':method :status :req[host] :url',
    options: {}
  },
  /**
   * 是否已经检查
   */
  isChecked: false,
  /**
   * 是否安装
   */
  isInstalled: false

  //proxy: {
  //  "api.heineiuo.com": "http://127.0.0.1:8888",
  //  "api.youkuohao.com": "http://127.0.0.1:8888",
  //  "static1.heineiuo.com": "http://127.0.0.1:8001"
  //},
  //
  //block_host: [],

};
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

// global variables
var db = {}


db.cname = new Datastore({
  filename: path.join(__dirname, './data/cname.db'),
  autoload: true
})
db.host = new Datastore({
  filename: path.join(__dirname, './data/host.db'),
  autoload: true
})
db.config = new Datastore({
  filename: path.join(__dirname, './data/config.db'),
  autoload: true
})


/**
 * doc insert demo
 */
//var doc = { hello: 'world'
//  , n: 5
//  , today: new Date()
//  , nedbIsAwesome: true
//  , notthere: null
//  , notToBeSaved: undefined  // Will not be saved
//  , fruits: [ 'apple', 'orange', 'pear' ]
//  , infos: { name: 'nedb' }
//};
//
//db.host.insert(doc, function (err, newDoc) {   // Callback is optional
//  // newDoc is the newly inserted document, including its _id
//  // newDoc has no key called notToBeSaved since its value was undefined
//
//});


;
//model('Host', [
//  ['hostId', String],
//  ['appId', String],
//  ['userId', String],
//  ['hostname', String],
//  ['sub', String], // 二级域名
//  ['protocol', String, 'http:'],
//]);
var checkInstall = function(req, res, next){

  if (conf.isChecked) return next()

  db.config.findOne({}, function(err, doc){
    conf.isChecked = true
    if (err) return res.sendStatus(500)
    if (doc) {
      conf.isInstalled = true
      conf = _.extend(conf, doc)
    }
    next()
  })

};
var cnameApp = {}

/**
 * 需要安装
 */
cnameApp.requireInstall = function(req, res, next) {
  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
  next()
}

/**
 * 需要和安装后的名称一致
 */
cnameApp.requireEqualHost = function(req, res, next) {
  // 未安装的,直接通过
  if (!conf.isInstalled) return next()
  // 已安装的,检查是否一致
  if (req.hostname !== conf.hostname) return res.json({error: 'UNEQUAL_HOSTNAME'})
  next()
}

/**
 * 需要登录
 */
cnameApp.requireAdmin = function(req, res, next) {
  if (!_.has(req.locals, 'admin')) return res.json({error: 'PERMISSION_DENIED'})
  next()
}



/**
 * 获取状
 */
cnameApp.status = function(req, res, next) {
  res.json(conf)
}

/**
 * 安装
 */
cnameApp.install = function(req, res, next) {
  if (conf.isInstalled) return res.sendStatus(403)

  // TODO install
  res.sendStatus(500)

}



/**
 * 登录
 */
cnameApp.login = function(req, res, next) {
  res.json({})
}





cnameApp.renderApp = function(req, res, next){

  res.end('cname app')

};
var errHandle = {}


errHandle.status500 = function(req, res){
  res.sendStatus(404)
}

errHandle.status404 = function(req, res){
  res.sendStatus(404)
};
var hostParser = function(req, res, next) {

  if (!conf.isInstalled) return next()
  if (req.hostname == conf.hostname) return next()

  // 是否需要解析
  db.host.findOne({hostname: req.hostname}, function (err, doc) {
    if (err) return res.sendStatus(500)
    if (!doc) return res.sendStatus(404)
    req.locals.host = doc
    var hostId = doc.hostId

    // 是否需要被屏蔽
    db.cname.findOne({hostId: hostId, type: 'block'}, function (err, doc) {
      if (err) return res.sendStatus(500)
      if (doc) return res.redirect('http://www.google.com')

      // 解析类型
      db.cname.findOne({hostId: hostId, pathname: req.pathname}, function(err, doc){
        if (err) return res.sendStatus(500)
        if (!doc) return res.sendStatus(404)

        if (doc.type == 'proxy') {
          // todo handle ssl cert to options
          var options = {
            //protocolRewrite: 'http'
          }
          var target = conf.proxy[req.headers.host]
          httpProxy.createProxyServer(options).web(req, res, {
            target: target
          }, function (err) {
            if (err) {
              console.log(err)
              res.sendStatus(502)
            }
            res.end()
          })
        } else if (doc.type = 'html') {
          res.end(doc.content)
        } else {
          res.sendStatus(404)
        }

      })

    })
  })




  /**
   * 返回APP
   */
  function renderApp(req, res, next){

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

  }



  /**
   * 检查是否需要更新html文件
   * @param req
   * @param res
   * @param next
   * @returns {boolean}
   */
  function updateCheck(req, res, next){

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

  }

};
/**
 * 统一返回客户端, 路由交给客户端处理
 */
router.route(['/', '/install', '/host']).get(
  cnameApp.requireEqualHost,
  cnameApp.renderApp
)

/**
 * 客户端获取app状态(已安装/未安装)
 */
router.route('/api/status').get(
  cnameApp.requireEqualHost,
  cnameApp.status
)

/**
 * 安装app
 */
router.route('/api/install').post(
  cnameApp.install
)

/**
 * 获取cnames
 */
router.route('/api/cnames').post(
  cnameApp.requireInstall,
  cnameApp.requireEqualHost,
  cnameApp.requireAdmin
)

/**
 * 新建cname
 */
router.route('/api/cname/create').post(
  cnameApp.requireInstall,
  cnameApp.requireEqualHost,
  cnameApp.requireAdmin
);
// set
app.set('x-powered-by', false)
// middleware
app.use(morgan(conf.morgan.format, conf.morgan.options))
app.use(checkInstall)
app.use(hostParser)
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)
app.use(errHandle.status500)
app.use(errHandle.status404)

// 检查是否登录
db.config.findOne({}, function(err, doc){
  if (err) return console.log(err)
  if (doc) {
    conf = doc
    conf.isInstalled = true
  }

  // listen http
  http.listen(80, function(){
    console.log('Listening on port 80')
  })

  // listen https
  //pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  //  https.createServer({
  //    key: keys.serviceKey,
  //    cert: keys.certificate
  //  }, app).listen(443, function(){
  //    console.log('Listening on port 443')
  // })
  //})

})
