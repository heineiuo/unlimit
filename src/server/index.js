// set
app.set('x-powered-by', false)
// middleware
app.use(morgan(conf.morgan.format, conf.morgan.options))
app.use(hostParser.checkInstall)
app.use(hostParser.parse)
app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(router)
app.use('/assets', express.static(path.join(__dirname, './public/assets')))
app.use(function(err, req, res, next){
  if (!err) return next()
  res.sendStatus(500)
})
app.use(function(req, res){
  res.sendStatus(404)
})


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
