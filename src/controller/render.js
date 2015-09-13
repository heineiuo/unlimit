var fs = require('fs')
var path = require('fs')
var _ = require('lodash')
var conf = require('../conf')

var render = module.exports = {}

var indexfile = conf.indexfile

render.renderApp = function(req, res){

  var appfile = indexfile[req.host] || ''

  if (appfile == ''){
    res.status(404)
    res.end()
  } else if (typeof appfile != 'object') {
    res.end(appfile)
  } else {

    var anwser_arr = _.without(req.url.split('/'), '')

    _.find(appfile, function(val, key){

      if (testPathname(key, anwser_arr)){
        return res.end(val)
      }

    })

    res.status(404)
    res.end()

    function testPathname(ask, anwser_arr){
      var ask_arr = _.without(ask.split('/'), '')
      var anwser_arr_change = _.take(anwser_arr, ask_arr.length)
      if (_.difference(ask_arr, anwser_arr_change).length > 0) {
        return false
      }
      return true
    }

  }

}