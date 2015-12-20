
app.set('x-powered-by', false)

app.use(morgan(conf.morgan.format, conf.morgan.options))

app.use(controller.blockCheck)
app.use(controller.proxyCheck)
app.use(controller.updateCheck)

app.use(bodyParser.json())
app.use(bodyParser.json({type: 'application/*+json'}))
app.use(bodyParser.json({type: 'text/html'}))
app.use(bodyParser.urlencoded({extended: false}))

app.use(controller.renderApp)
app.use(controller.error500)
app.use(controller.error404)

http.listen(80, function(){
  console.log('Listening on port 80')
})

//pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
//  https.createServer({
//    key: keys.serviceKey,
//    cert: keys.certificate
//  }, app).listen(443, function(){
//    console.log('Listening on port 443')
// })
//})

