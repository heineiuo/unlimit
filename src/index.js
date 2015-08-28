var express = require('express')
var _ = require('lodash')
var defaultSettings = require('./conf')

var server = module.exports = function(options){

  var settings = _.extend(defaultSettings, options)

  var app = express()

  app.use(function(req, res){

    res.send(req.host)

  })

  app.listen(settings.port, '127.0.0.1', function(){
    console.log('Listenint on port: '+settings.port)
  })

}