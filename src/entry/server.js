const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const pem = require('pem')
const comression = require('compression')
const fs = require('fs-promise')
const http = require('http')
const https = require('https')
const argv = require('../util/argv')

const getKeyPair = (host)=>{
  return {
    key: fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${host}/cert.pem`, 'utf8')
  }
}

const start = async ()=>{

  try {
    const app = require('express')()
    const conf = JSON.parse(await fs.readFile(`${process.cwd()}/data/config.json`, 'utf-8'))

    app.use(comression())
    app.use(require('morgan')(':req[host]:url :method :status :res[content-length] - :response-time ms', {}))
    app.use(require('../middleware/redirectToHttps')(conf))
    app.use(require('../middleware/headers')(conf))
    app.use(require('../middleware/proxy')(conf))
    app.use(require('../middleware/requireEqualHost')(conf))
    app.use(bodyParser.json({limit: "2mb"}))
    app.use(bodyParser.json({type: 'text/html'}))
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json({type: 'application/*+json'}))
    app.use('/api/host', require('../router/host'))
    // app.use('/api/file', require('../router/file'))
    app.use('/api/location', require('../router/location'))
    app.use('/api/status', require('../router/status'))
    app.use(express.static(`${process.cwd()}/public`))
    app.use(require('../middleware/error')(conf))

    const http_server = http.createServer(app)
    http_server.listen(80, function(){
      console.log('Listening on port 80')
    })

    if (!argv.nohttps){
      const https_server = https.createServer(getKeyPair(conf.https[0]), app)
      conf.https.forEach((host, index)=>{
        if (index>0)https_server.addContext(host, getKeyPair(host))
      })
      https_server.listen(443, function(){
        console.log('Listening on port 443')
      })
    }

  } catch(e){
    console.error(e)
    console.error(e.stack)
  }


}

start()
