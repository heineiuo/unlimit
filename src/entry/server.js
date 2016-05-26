const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const pem = require('pem')
const comression = require('compression')
const fs = require('fs-promise')
const http = require('http')
const https = require('https')

const start = async ()=>{

  try {
    const app = require('express')()
    const conf = JSON.parse(await fs.readFile(`${process.cwd()}/data/config.json`, 'utf-8'))

    app.set('x-powered-by', false)
    app.use(comression())
    app.use(require('morgan')('dev', {}))
    app.use(require('../middleware/redirectToHttps')(conf))
    app.use(require('../router/proxy'))
    app.use(require('../middleware/requireEqualHost')(conf))
    app.use(bodyParser.json({limit: "2mb"}))
    app.use(bodyParser.json({type: 'application/*+json'}))
    app.use(bodyParser.json({type: 'text/html'}))
    app.use(bodyParser.urlencoded({limit: "2mb", extended: false}))
    // app.use(require('../router/host'))
    // app.use(require('../router/file'))
    app.use('/api/status', require('../router/status'))
    app.use(express.static(`${process.cwd()}/public`))
    app.use(require('../middleware/error').err500)
    app.use(require('../middleware/error').err404)

    const getKeyPair = (host)=>{
      return {
        key: fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`, 'utf8'),
        cert: fs.readFileSync(`/etc/letsencrypt/live/${host}/cert.pem`, 'utf8')
      }
    }

    const http_server = http.createServer(app)
    const https_server = https.createServer(getKeyPair(conf.https[0]), app)

    conf.https.forEach(host=>{
      https_server.addContext(host, getKeyPair(host))
    })

    http_server.listen(80, function(){
      console.log('Listening on port 80')
    })
    https_server.listen(443, function(){
      console.log('Listening on port 443')
    })


  } catch(e){
    console.error(e)
  }



}

start()
