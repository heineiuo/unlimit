/**
 * Created by Hansel.
 * 项目配置
 */

var conf = require('./conf')
var app = require('./lib/pansy').Main()


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
//if (location.protocol == 'file:') {
//  app.config('routeByQuery', true)
//  conf.hrefPrefix = '?route='
//  conf.access_token = 'fadfafsadffdafsf'
//  conf.user = {username: 'test'}
//}
$("#onloading").remove()
app.go()
