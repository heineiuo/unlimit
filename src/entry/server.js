import express from 'express'
import fs from 'fs-promise'
import http from 'http'
import https from 'https'
import config from '../util/config'

const getKeyPair = (host) => {
  const pair = [
    fs.readFileSync(`/etc/letsencrypt/live/${host}/privkey.pem`, 'utf8'),
    fs.readFileSync(`/etc/letsencrypt/live/${host}/cert.pem`, 'utf8'),
    fs.readFileSync(`/etc/letsencrypt/live/${host}/chain.pem`)
  ]
  return {
    key: pair[0],
    cert: pair[1],
    ca: pair[2]
  }
}

const start = async () => {

  try {
    const app = express()

    app.use(require('morgan')(':req[host]:url :method :status :res[content-length] - :response-time ms', {}))
    app.use(require('compression')())
    app.use(require('../middleware/seashellMiddleware')(config))
    app.use(require('../middleware/redirectToHttps')(config))
    app.use(require('../middleware/headers')(config))
    app.use(require('../proxy')(config))
    app.use(require('../middleware/error')(config))

    const http_server = http.createServer(app)
    http_server.listen(80, function(){
      console.log('Listening on port 80')
    })

    if (!config.nohttps){
      const https_server = https.createServer(getKeyPair(config.https[0]), app)
      config.https.forEach((host, index) => {
        if (index > 0) https_server.addContext(host, getKeyPair(host))
      })
      https_server.listen(443, function(){
        console.log('Listening on port 443')
      })
    }

  } catch(e){
    console.error(e.stack)
  }

}

start()