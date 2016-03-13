
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
app.use(require('./controller/cname').checkInstall)
app.use(hostParser.middleware())
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(require('./router'))
app.use(express.static('./public', {
  maxAge: 8640000000000,
  setHeaders: function(res, path, stat){
    res.set("Access-Control-Allow-Origin", "*")
  }
}))
app.use(function(err, req, res, next){
  if (!err) return next()
  console.log(err)
  if (typeof err === 'string' && _.has(conf.errorData, err)) {
    return res.json(conf.errorData[err])
  }
  res.sendStatus(500)
})
app.use(function(req, res){
  res.sendStatus(404)
})

// 检查是否已安装
db.config.findOne({}, function(err, doc){
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
  //pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  //  var keyAndCert = {
  //    key: keys.serviceKey,
  //    cert: keys.certificate
  //  }
  //
  //  https.createServer(keyAndCert, app).listen(443, function(){
  //    console.log('Listening on port 443')
  // })
  //})

})

