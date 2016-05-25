// node_modules
var bodyParser = require('body-parser')
var express = require('express')
var morgan = require('morgan')
var pem = require('pem')
var _ = require('lodash')
var comression = require('compression')
var fs = require('fs')


//pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
//  var keyAndCert = {
//    key: keys.serviceKey,
//    cert: keys.certificate
//  }
//})
var app = require('express')()
var http = require('http')
var https = require('https')

// self modules
var conf = require('./conf')

app.set('x-powered-by', false)
app.use(comression())
app.use(require('morgan')(conf.morgan.format, conf.morgan.options))
app.use(require('./controller/main').checkInstall)
app.use(require('./lib/hostParser').middleware())
app.use(bodyParser.json({limit: "2mb"}))
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({limit: "2mb", extended: false}))
app.use(require('./router'))
app.use(require('./router/client'))
app.use(require('./controller/error').err500)
app.use(require('./controller/error').err404)



const SNIContexts = {
  'git.youkuohao.com': {
    key: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/git.youkuohao.com/cert.pem', 'utf8')
  },

  'www.youkuohao.com': {
    key: fs.readFileSync('/etc/letsencrypt/live/www.youkuohao.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.youkuohao.com/cert.pem', 'utf8')
  }
}




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
  http.createServer(app).listen(80, function(){
    console.log('Listening on port 80')
  })

  // listen https
  const https_server = https.createServer(SNIContexts['www.youkuohao.com'], app)

  https_server.addContext('git.youkuohao.com', SNIContexts['git.youkuohao.com'])

  https_server.listen(443, function(){
    console.log('Listening on port 443')
  })

})

