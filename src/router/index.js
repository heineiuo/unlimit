import {App} from 'seashell-client-node'

const seashellMiddleware = (conf) => {

  const app = new App()

  app.use('/host/list', require('./host/list'))
  app.use('/host/detail', require('./host/detail'))
  app.use('/host/delete', require('./host/delete'))
  app.use('/host/new', require('./host/new'))
  app.use('/location/new', require('./location/new'))
  app.use('/location/delete', require('./location/delete'))
  app.use('/location/detail', require('./location/detail'))
  app.use('/location/edit', require('./location/edit'))
  app.use('/location/list', require('./location/list'))
  app.use('/location/new', require('./location/new'))
  app.use('/location/update-sort', require('./location/update-sort'))

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