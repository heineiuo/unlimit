var express = require('express')
var _ = require('lodash')
var morgan = require('morgan')

var conf = require('./conf')
var controller = require('./controller')
var route = require('./route')

var server = module.exports = function(options){

  conf = _.extend(conf, options)

  var app = express()
  app.set('x-powered-by', false)
  app.use(morgan(conf.morgan.format, conf.morgan.options))
  app.use(controller.proxy.check)
  app.use(controller.update.check)
  app.use(controller.render.renderApp)
  app.use(route)
  app.use(controller.error.err500)
  app.use(controller.error.err404)

  app.listen(conf.port, function(){
    console.log('Start listening on port: '+conf.port)
    console.log('Start listening on time: '+new Date())
  })

}