var express = require('express')
var _ = require('lodash')
var expressResHtml = require('express-res-html')
var morgan = require('morgan')

var conf = require('./conf')
var controller = require('./controller')

var server = module.exports = function(options){

  conf = _.extend(conf, options)

  var app = express()

  app.use(morgan(conf.morgan))
  app.use(expressResHtml)
  app.use(controller.update.check)
  app.use(controller.render.renderApp)

  app.listen(conf.port, '127.0.0.1', function(){
    console.log('Listenint on port: '+conf.port)
  })

}