var hostParser = function(req, res, next) {

  if (!conf.isInstalled) return next()
  if (req.hostname == conf.hostname) return next()

  // 是否需要解析
  db.host.findOne({hostname: req.hostname}, function (err, doc) {
    if (err) return res.sendStatus(500)
    if (!doc) return res.sendStatus(404)
    req.locals.host = doc
    var hostId = doc.hostId

    // 是否需要被屏蔽
    db.cname.findOne({hostId: hostId, type: 'block'}, function (err, doc) {
      if (err) return res.sendStatus(500)
      if (doc) return res.redirect('http://www.google.com')

      // 解析类型
      db.cname.findOne({hostId: hostId, pathname: req.pathname}, function(err, doc){
        if (err) return res.sendStatus(500)
        if (!doc) return res.sendStatus(404)

        if (doc.type == 'proxy') {
          // todo handle ssl cert to options
          var options = {
            //protocolRewrite: 'http'
          }
          var target = conf.proxy[req.headers.host]
          httpProxy.createProxyServer(options).web(req, res, {
            target: target
          }, function (err) {
            if (err) {
              console.log(err)
              res.sendStatus(502)
            }
            res.end()
          })
        } else if (doc.type = 'html') {
          res.end(doc.content)
        } else {
          res.sendStatus(404)
        }

      })

    })
  })




  /**
   * 返回APP
   */
  function renderApp(req, res, next){

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

  }



  /**
   * 检查是否需要更新html文件
   * @param req
   * @param res
   * @param next
   * @returns {boolean}
   */
  function updateCheck(req, res, next){

    next()

    if (conf.cnameUpdating) return false
    if (Date.now() < conf.cnameExpire) return false
    conf.cnameUpdating = true

    var options = {
      method: 'POST',
      url: conf.API_HOST+'/service/cname',
      form: {
        appId: conf.appId,
        appSecret: conf.appSecret
      }
    }

    console.log('正在更新....')

    request(options, function(err, data){

      if (err) {
        conf.cnameUpdating = false
        return false
      }

      try {

        var bodyJSON =  JSON.parse(data.body)
        if (bodyJSON.error) {
          return console.log('更新失败：服务器返回错误: '+bodyJSON.error)
        }
        bodyJSON.update_time = new Date()
        conf.cname = bodyJSON
        conf.cnameExpire = Date.now() + conf.timeout

        // 写入文件
        fs.writeFile(conf.appdata+'/cname.json', JSON.stringify(bodyJSON), 'utf-8', function(err){
          if (err) {
            console.log(err)
            console.log('更新失败: 保存cname信息失败')
          }
          conf.cnameUpdating = false
          console.log('更新成功.')
        })

      } catch (e){
        console.log(e)
        console.log('更新失败: 异常')
        conf.cnameUpdating = false
      }

    })

  }

}