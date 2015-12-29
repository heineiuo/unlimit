/**
 * Created by Hansel.
 * 项目配置
 */


var app = pansy()

//app.config('spa', true)

app.use(function(req, res, next){
  ajax('serverStatus').exec(function(err, result){
    if (err) {
      return alert(err)
    }
    req.serverStatus = result
    next()
  })
})

app.use(mainRouter)

app.use(function(req, res){
  console.log('404')
  $("#container").html('404 not found')
  res.end()
})

/**
 * 配置启动项
 */
$(document).ready(function(){
  if (location.protocol == 'file:') {
    app.config('routeByQuery', true)
    conf.hrefPrefix = '?route='
    conf.access_token = 'fadfafsadffdafsf'
    conf.user = {username: 'test'}
  }
  $("#onloading").remove()
  app.go()
})