import {App} from 'seashell'

const seashellMiddleware = (conf) => {

  const app = new App()

  app.use('/host', require('../router/host'))
  app.use('/location', require('../router/location'))
  app.use('/status', require('../router/status'))

  app.use(async (err, req, res, next) => {
    if (typeof err == 'string') {
      res.body = {error: err}
    } else if (typeof err.stack != 'undefined') {
      console.log(err.stack)
      if (err.name == 'ValidationError') {
        res.body = {error: 'PARAM_ILLEGAL'}
      } else {
        res.body = {error: 'EXCEPTION_ERROR'}
      }
    } else {
      res.body = {error: "EXCEPTION_ERROR"}
    }
    res.end()
  })

  app.use(async (req, res, next) => {
    res.end({error: 'NOT_FOUND'})
  })

  app.connect(conf.seashell)

  return (req, res, next) => {
    res.locals.seashell = app
    next()
  }
}

module.exports = seashellMiddleware