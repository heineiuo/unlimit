/**
 * Created by Hansel.
 * 项目配置
 */

window.$ = window.jQuery = require('./lib/jquery.min')
window._ = require('./lib/lodash.min')
require('./lib/bootstrap.min')

var conf = require('./conf')
var app = require('pansy').Main()


//app.config('spa', true)

app.set('routeScope', conf.routeScope)

app.use(require('./router'))

app.use(function(req, res){
  console.log('404')
  $("#container").html('404 not found')
  res.end()
})

/**
 * 配置启动项
 */

$("#onloading").remove()
app.go()
