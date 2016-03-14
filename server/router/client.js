var path = require('path')
var express = require('express')
var router = module.exports = express.Router()
var Location = require('../controller/Location')

var clientPath = path.join(__dirname, process.env.DEBUG?'client':'../../dist/client')

// 客户端路由, 返回客户端处理
router.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(
  Location.requireEqualHost,
  function(req, res){
    res.sendFile('www/index.html', {
      root: clientPath
    })
  }
)

router.use('/client', express.static(clientPath, {
  maxAge: 8640000000000,
  setHeaders: function(res, path, stat){
    res.set("Access-Control-Allow-Origin", "*")
  }
}))