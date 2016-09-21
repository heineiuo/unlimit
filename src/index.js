import {App} from 'seashell-client-node'
import * as cli from './cli'
import config from './utils/config'

const app = new App()

app.use((req, res, next) => {
  res.json = (data) => {
    res.body = data
    res.end()
  }

  res.app = app
  next()
})

app.use(require('./http')(config, app))
app.use(require('./routes'))

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

app.use((req, res) => {
  res.json({error: 'NOT_FOUND'})
});

(function (){
  if (config.start) return app.connect(config.seashell)
  if (config.help) return cli.help()
  if (config.listhost) return cli.listhost()
  if (config.listLocationByHost) return cli.listLocationByhost()
  if (config.createHost) return cli.createHost()
  if (config.createLocation) return cli.createLocation()
  if (config.deleteHost) return cli.deleteHost()
  if (config.updateLocation) return cli.updateLocation()
  if (config.deleteLocation) return cli.deleteLocation()
})()

export default module.exports = app