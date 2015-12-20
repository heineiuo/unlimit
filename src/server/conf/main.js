
conf = _.extend(conf, {
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

})
