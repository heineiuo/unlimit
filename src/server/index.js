
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
var app = require('express')()
var http = require('http').Server(app)

// self modules
var conf = require('./conf')
var db = require('./model/db')
var hostParser = require('./lib/hostParser')

// set
app.set('x-powered-by', false)
// middleware
app.use(require('morgan')(conf.morgan.format, conf.morgan.options))
app.use(hostParser.checkInstall)
app.use(hostParser.parse)
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(require('./router/main'))
app.use(express.static('./public'))
app.use(function(err, req, res, next){
  if (!err) return next()
  console.log('错误中间件处理结果:')
  console.log(err)
  res.sendStatus(500)
})
app.use(function(req, res){
  res.sendStatus(404)
})

// 检查是否已安装
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
