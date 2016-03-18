// built-in modules
var path = require('path')
var crypto = require('crypto')
var fs = require('fs')
var tls = require('tls')
var net = require('net')

// node_modules
var async = require('async')
//var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var express = require('express')
var parse = require('url-parse')
var morgan = require('morgan')
var ent = require('ent')
var pem = require('pem')
var _ = require('lodash')
var Datastore = require('nedb')
var comression = require('compression')


//pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
//  var keyAndCert = {
//    key: keys.serviceKey,
//    cert: keys.certificate
//  }
//})
var app = require('express')()
var http = require('http').Server(app)
//var https = require('https').Server(keyAndCert, app)

// self modules
var conf = require('./conf')

app.set('x-powered-by', false)
app.use(comression())
app.use(require('morgan')(conf.morgan.format, conf.morgan.options))
app.use(require('./controller/main').checkInstall)
app.use(require('./lib/hostParser').middleware())
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(require('./router'))
app.use(require('./router/client'))
app.use(require('./controller/error').err500)
app.use(require('./controller/error').err404)


// 检查是否已安装
var Config = require('./model/Config')
Config.findOne({}, function(err, doc){
  if (err) return console.log(err)
  if (doc) {
    conf.isInstalled = true
    _.forEach(_.omit(doc, ['_id']), function (val, key) {
      conf[key] = val
    })
  }

  // listen http
  http.listen(conf.port, function(){
    console.log('Listening on port '+conf.port)
  })

  // listen https
  //  https.listen(443, function(){
  //    console.log('Listening on port 443')
  // })

})

