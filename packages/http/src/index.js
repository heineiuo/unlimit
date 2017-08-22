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
import { match, when } from 'match-when'
import router from "./router"
import { SNICallback, updateCert } from './sni'

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
  NPM_REGISTRY,
  DB_ADAPTER,
  MONGODB_URL
} = process.env

const db = match(DB_ADAPTER, {
  [when()]: async () => {
    const mongodb = await import('./adapter/mongodb')
    return await mongodb.default({
      mongodbUrl: MONGODB_URL
    })
  }
})




const app = express()

app.use(morgan('[:req[host]:url][:status][:response-time ms]', {}))
app.use(compression())
app.use(letiny.webrootChallengeMiddleware(tmpdir()))
app.use(router({
  db,
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

if (NODE_ENV === 'development') {
  const httpServer = http.createServer(app)
  httpServer.listen(80, () => console.log(`dev http ${process.pid} started`))
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
  httpServer.listen(80, () => console.log(`Worker http ${process.pid} started`))
  if (process.env.HTTPS_ENABLE) {
    const httpsServer = https.createServer({SNICallback}, app)
    httpsServer.listen(443, () => console.log(`Worker https ${process.pid} started`))
  }
}
