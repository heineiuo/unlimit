// set
app.set('x-powered-by', false)
// middleware
app.use(morgan(conf.morgan.format, conf.morgan.options))
app.use(checkInstall)
app.use(hostParser)
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)
app.use(errHandle.status500)
app.use(errHandle.status404)

// 检查是否登录
db.config.findOne({}, function(err, doc){
  if (err) return console.log(err)
  if (doc) {
    conf = doc
    conf.isInstalled = true
  }

  // listen http
  http.listen(80, function(){
    console.log('Listening on port 80')
  })

  // listen https
  //pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  //  https.createServer({
  //    key: keys.serviceKey,
  //    cert: keys.certificate
  //  }, app).listen(443, function(){
  //    console.log('Listening on port 443')
  // })
  //})

})
