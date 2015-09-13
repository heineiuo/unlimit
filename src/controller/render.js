var fs = require('fs')
var path = require('fs')
var _ = require('lodash')

var render = module.exports = {}
var indexfile = {
  "localhost": {
    "/": '<!doctype html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, user-scalable=no"> <title>Heineiuo Admin</title> <link rel="stylesheet" href="http://cdn1.heineiuo.com/748217591/index.css"/> <script src="http://cdn1.heineiuo.com/748217591/vendor.js"></script> <script src="http://cdn1.heineiuo.com/748217591/template.js"></script> <script src="http://cdn1.heineiuo.com/748217591/index.js"></script> </head> <body> <div id="view-scope"></div> </body> </html>'
  },
  "i.heineiuo.com": {
    "/": '<!doctype html> <html> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, user-scalable=no"> <title>Heineiuo Admin</title> <link rel="stylesheet" href="http://cdn1.heineiuo.com/748217591/index.css"/> <script src="http://cdn1.heineiuo.com/748217591/vendor.js"></script> <script src="http://cdn1.heineiuo.com/748217591/template.js"></script> <script src="http://cdn1.heineiuo.com/748217591/index.js"></script> </head> <body> <div id="view-scope"></div> </body> </html>'
  },
  "www.youkuohao.com": {
    "/": '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, user-scalable=no"> <title>右括号工作室</title></head><body> 右括号工作室正在建设中，敬请期待！</body> </html>'
  }


}

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