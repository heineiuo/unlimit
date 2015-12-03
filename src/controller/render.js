var controller = controller  || purple.Controller()

controller('render.renderApp', function(req, res, next){

  // 获取地址
  var url = parse(req.headers.host + req.url , true)
  // 自动补上'/'
  if(url.pathname =='') url.pathname = '/'

  // 查找路由
  var result = {}
  _.map(conf.cname.list, function(val, key){
    if (val.hostname != url.host) return true
    var reg = new RegExp(_.trim(val.pathname, '/').replace('\\\\','\\'))
    var match = url.pathname.match(reg)
    if (match && match[0] == url.pathname) {
      result = val
      return false
    }
  })

  if (!_.has(result,'type')) return next()
  if (result.type == 'redirect') return res.redirect(result.content)
  if (result.type == 'html') return res.send(ent.decode(result.content))
  if (result.type == 'api') {

    var options = {
      method: 'POST',
      url: conf.API_HOST + result.content,
      qs: req.query,
      form: _.extend(req.body, req.query, {
        appId: conf.appId,
        appSecret: conf.appSecret,
        proxyAppId: result.appId
      })
    }

    request(options, function(err, response, body){
      if (err) return res.send(500)
      try {
        res.json(JSON.parse(body))
      } catch(e){
        console.log(body)
        res.send(502)
      }
    })
  } else {
    next()
  }
})