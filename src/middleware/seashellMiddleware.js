import {App} from 'seashell'

const seashellMiddleware = (conf) => {

  const seashell = new App()

  seashell.use(require('../seashell'))

  seashell.connect(conf.seashell)

  return (req, res, next) => {
    res.locals.seashell = seashell
    next()
  }
}

module.exports = seashellMiddleware