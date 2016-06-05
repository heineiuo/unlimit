var _ = require('lodash')
import {Router} from 'express'

const middleware = (conf) => {
  const router = Router()

  router.use((err, req, res, next) => {
    console.error(err)
    if (!res.headersSent) {
      if (!err) return next()
      if (typeof err === 'string') return res.json({error: err})
      res.json({error: 'EXCEPTION_ERROR'})
    }
  })

  router.use((req, res) => {
    if (!res.headersSent) res.end('NOT FOUND')
  })

  return router

}

module.exports = middleware