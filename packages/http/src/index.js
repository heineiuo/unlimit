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
import { homedir } from "os"
import http from "http"
import https from "https"
import fs from 'mz/fs'
import path from 'path'
import tls from 'tls'
import dotenv from 'dotenv'
import cluster from 'cluster'
import bodyParser from "body-parser"
import { createRequestHandler } from 'express-unpkg'
import { cpus } from 'os'
import { match, when } from 'match-when'
import { routerMiddleware, routerUpdate } from "./router"
import { SNICallback, SNIMiddleware, SNIUpdate } from './sni'
import { getDb } from './adapter'

let { NODE_ENV = 'development', DATA_DIR = path.resolve(homedir(), './.unlimit') } = process.env

if (NODE_ENV === 'development'){
  DATA_DIR = process.env.DATA_DIR = path.resolve(process.cwd(), './.unlimit')
}

const envPath = path.resolve(DATA_DIR, './.env')
if (dotenv.config({path: envPath}).error) {
  const defaultEnv = 
`# unlimit
DB_ADAPTER = mongodb
MONGODB_URL = mongodb://localhost
NPM_REGISTRY = https://registry.npmjs.org`
  shell.exec(`mkdir -p ${DATA_DIR}`)
  fs.writeFileSync(envPath, defaultEnv, 'utf8')
  dotenv.config({path: envPath})
}

const {
  NPM_REGISTRY,
  DB_ADAPTER,
  MONGODB_URL,
  HTTP_PORT,
  HTTPS_PORT
} = process.env


const app = express()

app.use(morgan('dev'))
app.use(compression())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.json({type: 'text/plain'}))
app.use(SNIMiddleware())
app.use(routerMiddleware({
  getDb,
}))
app.use(createRequestHandler({
  registryURL: NPM_REGISTRY
}))

app.use((err, req, res, next) => {
  if (!err) return next()
  const unExceptionErrors = [
    'NotFoundError', 
    'ValidationError', 
    'ForbiddenError', 
    'ServerError'
  ]
  if (!unExceptionErrors.includes(err.name)) {
    console.log('Catch Exception Error: \n' + err.stack)
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

if (NODE_ENV === 'development') {
  const httpServer = http.createServer(app)
  httpServer.listen(HTTP_PORT, () => console.log(`dev http ${process.pid} started`))
} else if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  Array.from({length: cpus().length}, (v, k) => {
    cluster.fork()
  })
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  const httpServer = http.createServer(app)
  httpServer.listen(HTTP_PORT, () => console.log(`Worker http ${process.pid} started`))
  if (process.env.HTTPS_ENABLE) {
    const httpsServer = https.createServer({SNICallback}, app)
    httpsServer.listen(HTTPS_PORT, () => console.log(`Worker https ${process.pid} started`))
  }
}
