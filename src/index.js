var conf =  {
  appId: '621b898e-7f9e-4b44-8981-c971998a60ef',
  appSecret: '250af5fa7f6a86a245b161a83c1e0e17',
  appName: "cname-ecs6",
  API_HOST: 'http://127.0.0.1:8888',
  proxy: {
    "api.heineiuo.com": "http://127.0.0.1:8888",
    "api.youkuohao.com": "http://127.0.0.1:8888",
    "static1.heineiuo.com": "http://127.0.0.1:8001"
  },
  //block_host: ['lanmaotv.com', 'www.lanmaotv.com']
  block_host: [],

  ssl: {},
  isStarted: false,

  morgan: {
    format: ':method :status :req[host] :url',
    options: {}
  },

  cnameUpdating: false,
  timeout: 1000*30,
  cnameExpire: Date.now(),
  cname: {list: []},
  isInstalled: false,

  appdata: path.join(__dirname, './appdata'),

  md5: function (tobeHash) {
    return crypto.createHash('md5').update(tobeHash).digest('hex')
  }

}

if (!conf.isStarted) {

  var app = express()
  app.set('x-powered-by', false)

  app.use(morgan(conf.morgan.format, conf.morgan.options))

  app.use(controller('block.check'))
  app.use(controller('proxy.check'))
  app.use(controller('update.check'))

  app.use(bodyParser.json())
  app.use(bodyParser.json({type: 'application/*+json'}))
  app.use(bodyParser.json({type: 'text/html'}))
  app.use(bodyParser.urlencoded({extended: false}))

  app.use(controller('render.renderApp'))
  app.use(controller('error.err500'))
  app.use(controller('error.err404'))

  http.createServer(app).listen(80)
  console.log('Listening on port 80')
  //
  //pem.createCertificate({days:365, selfSigned:true}, function(err, keys){
  //  https.createServer({
  //    key: keys.serviceKey,
  //    cert: keys.certificate
  //  }, app).listen(443)
  //})

  console.log('Listening on port 443')
}

module.exports = app

