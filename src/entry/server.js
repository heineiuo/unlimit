import express from 'express'
import fs from 'fs-promise'
import http from 'http'
import https from 'https'
import argv from '../util/argv'

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
    const configPath = argv.config || `${process.cwd()}/data/config.json`
    const conf = JSON.parse(await fs.readFile(configPath, 'utf-8'))

    app.use(require('morgan')(':req[host]:url :method :status :res[content-length] - :response-time ms', {}))
    app.use(require('compression')())
    app.use(require('../middleware/seashellMiddleware')(conf))
    app.use(require('../middleware/redirectToHttps')(conf))
    app.use(require('../middleware/headers')(conf))
    app.use(require('../proxy')(conf))
    app.use(require('../middleware/requireEqualHost')(conf))

    /**
     * below is `cloud.youkuohao.com` router
     */
    app.use('/api', require('../router'))
    app.use(express.static(`${process.cwd()}/public`, {
      maxAge: 31536000000
    }))
    app.use(require('../middleware/error')(conf))

    const http_server = http.createServer(app)
    http_server.listen(80, function(){
      console.log('Listening on port 80')
    })

    if (!argv.nohttps){
      const https_server = https.createServer(getKeyPair(conf.https[0]), app)
      conf.https.forEach((host, index)=>{
        if (index > 0)https_server.addContext(host, getKeyPair(host))
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