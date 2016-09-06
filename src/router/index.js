import {App} from 'seashell-client-node'

const seashellMiddleware = (conf) => {

  const app = new App()

  app.use((req, res, next) => {
    res.json = (data) => {
      res.body = data
      res.end()
    }
    next()
  })

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

  app.use('/fs/cat', require('./fs/cat').default)
  app.use('/fs/ls', require('./fs/ls').default)

  app.use('/terminal', require('./terminal').default)


  app.use((err, req, res, next) => {
    if (typeof err == 'string') return res.json({error: err})

    if (err.hasOwnProperty('name')) {
      if (err.name == 'ValidationError') return res.json({error: 'PARAM_ILLEGAL'})
    }

    if (err.hasOwnProperty('stack')) {
      if (err.stack.indexOf('Error: Command failed') > -1) return res.json({error: 'COMMAND_FAILED'})
    }

    return res.json({error: "EXCEPTION_ERROR"})
  })

  app.use((req, res, next) => {
    res.json({error: 'NOT_FOUND'})
  })

  app.connect(conf.seashell)

  return (req, res, next) => {
    res.locals.seashell = app
    next()
  }
}

module.exports = seashellMiddleware