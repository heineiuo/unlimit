/**
 * This is an example integration, you should not use it directly in production.
 *
 * This integration shows how to proxy a http request to seashell,
 * this means you can write http api by seashell technology, then the only thing you
 * need do is the proxy.
 * This integration also show how to control an http service(like stop or restart), from seashell
 */

import morgan from "morgan"
import compression from "compression"
import express from "express"
import {homedir} from "os"
import http from "http"
import https from "https"
import letiny from 'letiny'
import {tmpdir} from 'os'
import fs from 'mz/fs'
import path from 'path'
import tls from 'tls'
import dotenv from 'dotenv'
import cluster from 'cluster'
import { createRequestHandler } from 'express-unpkg'
import { cpus } from 'os' 
import router from "./router"

const { NODE_ENV='development'} = process.env

if (NODE_ENV === 'development') {
  const dataDir = path.resolve(process.cwd(), './.unlimit')
  const envPath = path.resolve(dataDir, './.env')
  if (dotenv.config({path: envPath}).error) {
    const defaultEnv = `# unlimit
NPM_REGISTRY = https://registry.npmjs.org
DATA_DIR = ${dataDir}`
    shell.exec(`mkdir -p ${dataDir}`)
    fs.writeFileSync(envPath, defaultEnv, 'utf8')
    dotenv.config({path: envPath})
  }
}

const {
  DATA_DIR,
  PORT,
  NPM_REGISTRY
} = process.env

const unExceptionErrors = [
  'NotFoundError', 
  'ValidationError', 
  'ForbiddenError', 
  'ServerError'
]

const ctxMap = {}

const SNICallback = (servername, callback) => {
  const { HTTPS_APPROVED_DOMAINS, DATA_DIR } = process.env
  const pemdir = path.resolve(DATA_DIR, './pem')
  if (ctxMap[servername]) return callback(null, ctxMap[servername])
  if (!HTTPS_APPROVED_DOMAINS.includes(servername)) {
    const error = new Error('Unapproved domain')
    error.name = 'ForbiddenError'
    return callback(error)
  }
  fs.readFile(`${pemdir}/${servername}/pfx.pem`, (err, pfx) => {
    if (err) {
      console.log(err)
      return callback(err)
    }
    const ctx = ctxMap[servername] = tls.createSecureContext({pfx})
    callback(null, ctx)
  })
}

const app = express()

app.use(morgan('[:req[host]:url][:status][:response-time ms]', {}))
app.use(compression())
app.use(letiny.webrootChallengeMiddleware(tmpdir()))
app.use(router())
app.use(createRequestHandler({
  registryURL: NPM_REGISTRY
}))

app.use((err, req, res, next) => {
  if (!err) return next()
  if (!unExceptionErrors.includes(err.name)) {
    console.log('Catch Exception Error: \n' + err.message)
  }
  res.json({
    error: err.name, 
    message: err.message
  })
})

app.use((req, res) => {
  res.status(404)
  res.json({
    error: 'NotFoundError'
  })
})


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  Array.from({length: cpus().length}, (v, k) => {
    cluster.fork()
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  const httpServer = http.createServer(app)
  httpServer.listen(80, () => console.log(`Worker http ${process.pid} started`))
  if (process.env.HTTPS_ENABLE) {
    const httpsServer = https.createServer({SNICallback}, app)
    httpsServer.listen(443, () => console.log(`Worker https ${process.pid} started`))
  }
}
