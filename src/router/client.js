var path = require('path')
var express = require('express')
var router = module.exports = express.Router()

var clientPath = path.join(process.cwd(), process.env.DEBUG?'../../dist/client':'./client')

// 客户端路由, 返回客户端处理
router.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(
  // main.requireEqualHost,
  function(req, res, next){
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