/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	// built-in modules
	var path = __webpack_require__(1)
	var crypto = __webpack_require__(2)
	var fs = __webpack_require__(3)
	var tls = __webpack_require__(4)
	var net = __webpack_require__(5)

	// node_modules
	var async = __webpack_require__(6)
	//var cookieParser = require('cookie-parser')
	var bodyParser = __webpack_require__(7)
	var express = __webpack_require__(8)
	var parse = __webpack_require__(9)
	var morgan = __webpack_require__(10)
	var ent = __webpack_require__(11)
	var pem = __webpack_require__(12)
	var _ = __webpack_require__(13)
	var app = __webpack_require__(8)()
	var http = __webpack_require__(14).Server(app)

	// self modules
	var conf = __webpack_require__(15)
	var db = __webpack_require__(16)
	var hostParser = __webpack_require__(18)

	// set
	app.set('x-powered-by', false)
	// middleware
	app.use(__webpack_require__(10)(conf.morgan.format, conf.morgan.options))
	app.use(hostParser.checkInstall)
	app.use(hostParser.parse)
	app.use(bodyParser.json())
	app.use(bodyParser.json({type: 'application/*+json'}))
	app.use(bodyParser.json({type: 'text/html'}))
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(__webpack_require__(21))
	app.use(express.static('./public'))
	app.use(function(err, req, res, next){
	  if (!err) return next()
	  console.log('错误中间件处理结果:')
	  console.log(err)
	  res.sendStatus(500)
	})
	app.use(function(req, res){
	  res.sendStatus(404)
	})

	// 检查是否已安装
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("tls");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("net");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("async");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("url-parse");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("ent");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("pem");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 15 */
/***/ function(module, exports) {

	
	var conf = module.exports = {
	  /**
	   * 日志输出格式
	   */
	  morgan: {
	    format: ':method :status :req[host] :url',
	    options: {}
	  },
	  /**
	   * 是否已经检查
	   */
	  isChecked: false,
	  /**
	   * 是否安装
	   */
	  isInstalled: false
	  //isInstalled: true

	  //proxy: {
	  //  "api.heineiuo.com": "http://127.0.0.1:8888",
	  //  "api.youkuohao.com": "http://127.0.0.1:8888",
	  //  "static1.heineiuo.com": "http://127.0.0.1:8001"
	  //},
	  //
	  //block_host: [],

	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	// global variables
	var db = module.exports = {}
	var Datastore = __webpack_require__(17)

	db.cname = new Datastore({
	  filename: './data/cname.db',
	  autoload: true
	})
	db.host = new Datastore({
	  filename: './data/host.db',
	  autoload: true
	})
	db.config = new Datastore({
	  filename: './data/config.db',
	  autoload: true
	})

	/**
	 * doc insert demo
	 */
	//var doc = { hello: 'world'
	//  , n: 5
	//  , today: new Date()
	//  , nedbIsAwesome: true
	//  , notthere: null
	//  , notToBeSaved: undefined  // Will not be saved
	//  , fruits: [ 'apple', 'orange', 'pear' ]
	//  , infos: { name: 'nedb' }
	//};
	//
	//db.host.insert(doc, function (err, newDoc) {   // Callback is optional
	//  // newDoc is the newly inserted document, including its _id
	//  // newDoc has no key called notToBeSaved since its value was undefined
	//
	//});




/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("nedb");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * hostParser
	 * @param req
	 * @param res
	 * @param next
	 * @returns {*}
	 */
	var hostParser = module.exports = {}
	var httpProxy = __webpack_require__(19)
	var _ = __webpack_require__(13)
	var request = __webpack_require__(20)
	var conf = __webpack_require__(15)
	var db = __webpack_require__(16)
	var parse = __webpack_require__(9)
	var ent = __webpack_require__(11)

	hostParser.parse = function(req, res, next) {

	  if (!conf.isInstalled) return next()
	  if (req.headers.host == conf.hostname) return next()

	  // 是否存在host
	  db.host.findOne({hostname: req.headers.host}, function (err, doc) {

	    if (err) {
	      console.log('查询是否存在host失败')
	      console.log(err)
	      return res.sendStatus(500)
	    }
	    if (!doc) {
	      //console.log('DOMAIN NOT FOUND')
	      //return res.sendStatus(404)
	      return next()
	    }

	    // 查找cname
	    db.cname.find({hostId: doc._id}, function(err, docs) {

	      if (err) {
	        console.log('查找cname失败')
	        console.log(err)
	        return res.sendStatus(500)
	      }

	      if (docs.length == 0) {
	        console.log('CNAME LOG LOST')
	        return res.sendStatus(404)
	      }

	      // 获取url, 自动补上'/'
	      var url = parse(req.headers.host + req.url , true)
	      if (url.pathname =='') url.pathname = '/'

	      // 通过比对pathname, 找到路由
	      var result = {}
	      _.map(docs, function(doc, index){
	        var reg = new RegExp(_.trim(doc.pathname, '/').replace('\\\\','\\'))
	        var matches = url.pathname.match(reg)
	        if (matches && matches[0] == url.pathname) {
	          result = doc
	          return false
	        }
	      })

	      if (result.type == 'proxy') {
	        // todo handle ssl cert to options
	        var options = {
	          // protocolRewrite: 'http'
	        }
	        var target = result.content
	        httpProxy.createProxyServer(options).web(req, res, {
	          target: target
	        }, function (err) {
	          if (err) {
	            console.log(err)
	            return res.sendStatus(502)
	          }
	          res.end()
	        })
	        return false
	      }

	      if (result.type == 'block') return res.redirect('http://www.google.com')
	      if (result.type == 'redirect') return res.redirect(result.content)
	      if (result.type == 'html') return res.end(ent.decode(result.content))
	      if (result.type == 'api') {

	        var apiOptions = {
	          method: 'POST',
	          url: result.content,
	          qs: req.query,
	          form: _.extend(req.body, req.query, {
	            appId: conf.appId,
	            appSecret: conf.appSecret,
	            proxyAppId: result.appId
	          })
	        }

	        request(apiOptions, function(err, response, body){
	          if (err) {
	            console.log('请求外部接口失败')
	            console.log(err)
	            return res.sendStatus(500)
	          }
	          try {
	            res.json(JSON.parse(body))
	          } catch(e){
	            console.log(body)
	            res.sendStatus(502)
	          }
	        })

	        return false
	      }

	      return res.sendStatus(404)


	    })

	  })


	}



	/**
	 * 检查程序是否安装成功
	 * @param req
	 * @param res
	 * @param next
	 * @returns {*}
	 */
	hostParser.checkInstall = function(req, res, next){

	  if (conf.isChecked) return next()

	  db.config.findOne({}, function(err, doc){
	    conf.isChecked = true
	    if (err) {
	      console.log('检查是否安装失败')
	      console.log(err)
	      return res.sendStatus(500)
	    }
	    if (doc) {
	      conf.isInstalled = true
	      conf = _.extend(conf, doc)
	    }
	    next()
	  })

	}

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("http-proxy");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var router = module.exports = __webpack_require__(8).Router()


	var cnameController = __webpack_require__(22)
	var hostController = __webpack_require__(23)

	/**
	 * 统一返回客户端, 路由交给客户端处理
	 */
	router.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(
	  cnameController.requireEqualHost,
	  cnameController.renderApp
	)

	/**
	 * 客户端获取app状态(已安装/未安装)
	 */
	router.route('/api/status').all(
	  cnameController.requireEqualHost,
	  cnameController.status
	)

	/**
	 * 安装app
	 */
	router.route('/api/install').post(
	  cnameController.install
	)

	/**
	 * 获取cnames
	 */
	router.route('/api/cnames').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin
	)

	/**
	 * 新建cname
	 */
	router.route('/api/cname/create').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin
	)


	/**
	 * login
	 */
	router.route('/api/login').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.login
	)

	//
	//// 获取app列表
	//router.route('/api/app/list').post(
	//  cnameController.requireInstall,
	//  cnameController.requireEqualHost,
	//  cnameController.requireAdmin
	//
	//)
	//
	//// 获取app详情
	//router.route('/api/app/detail').post(
	//  cnameController.requireInstall,
	//  cnameController.requireEqualHost,
	//  cnameController.requireAdmin
	//)
	//
	//// 创建新的app
	//router.route('/api/app/new').post(
	//  cnameController.requireInstall,
	//  cnameController.requireEqualHost,
	//  cnameController.requireAdmin
	//)
	//
	//// 编辑app
	//router.route('/api/app/edit').post(
	//  cnameController.requireInstall,
	//  cnameController.requireEqualHost,
	//  cnameController.requireAdmin
	//)



	// 获取cname列表
	router.route('/api/cname/list').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  cnameController.cnameListRead
	)

	// 获取cname详情
	router.route('/api/cname/detail').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  cnameController.detail
	)

	router.route('/api/cname/new').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  cnameController.cnameCreate
	)

	router.route('/api/cname/edit').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  cnameController.cnameUpdate
	)


	router.route('/api/cname/delete').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  cnameController.delete
	)


	// 获取app列表
	router.route('/api/host/list').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  hostController.list
	)

	// 获取app详情
	router.route('/api/host/detail').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  hostController.detail
	)

	// 创建新的app
	router.route('/api/host/new').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  hostController.new
	)

	// 编辑app
	router.route('/api/host/edit').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  hostController.edit
	)


	// 删除app
	router.route('/api/host/delete').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin,
	  hostController.delete
	)



	router.route('/api/upload').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin
	)

	router.route('/api/tool/encode/html').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin
	)

	router.route('/api/tool/string2number').post(
	  cnameController.requireInstall,
	  cnameController.requireEqualHost,
	  cnameController.requireAdmin
	)


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var cnameController = module.exports = {}
	var conf = __webpack_require__(15)
	var db = __webpack_require__(16)
	var _ = __webpack_require__(13)

	/**
	 * 需要安装
	 */
	cnameController.requireInstall = function(req, res, next) {
	  if (!conf.isInstalled) return res.json({error: 'UNINSTALLED'})
	  next()
	}

	/**
	 * 需要和安装后的名称一致
	 */
	cnameController.requireEqualHost = function(req, res, next) {
	  return next()

	  // 未安装的,直接通过
	  if (!conf.isInstalled) return next()
	  // 已安装的,检查是否一致
	  if (req.hostname !== conf.hostname) return res.json({error: 'UNEQUAL_HOSTNAME'})
	  next()
	}

	/**
	 * 需要登录
	 */
	cnameController.requireAdmin = function(req, res, next) {
	  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
	  if (conf.password != req.body.password) return res.json({error: 'PERMISSION_DENIED'})
	  next()
	}



	/**
	 * 获取状态
	 */
	cnameController.status = function(req, res, next) {
	  var result = _.omit(conf, 'password', '_id')
	  result.logged = false
	  if (req.body.password == conf.password) {
	    result = _.extend(result, {
	      logged: true
	    })
	  }
	  res.json(result)
	}

	/**
	 * 安装
	 */
	cnameController.install = function(req, res, next) {
	  if (conf.isInstalled) return res.sendStatus(403)
	  db.config.insert(req.body, function(err, doc){
	    if (err) {
	      console.log('安装失败')
	      console.log(err)
	      return res.sendStatus(500)
	    }
	    conf = _.extend(conf, doc)
	    conf.isInstalled = true
	    res.json({})
	  })

	}



	/**
	 * 登录
	 */
	cnameController.login = function(req, res, next) {

	  if (!_.has(req.body, 'password')) return res.json({error: 'PERMISSION_DENIED'})
	  if (req.body.password != conf.password) return res.json({error: 'PERMISSION_DENIED'})

	  var result = _.omit(conf, 'password', '_id')
	  res.json(result)

	}


	/**
	 * 返回app
	 * @param req
	 * @param res
	 * @param next
	 */
	cnameController.renderApp = function(req, res, next){

	  res.sendFile(process.cwd() + '/public/index.html')
	}


	/** 创建一条cname记录 **/
	cnameController.cnameCreate = function(req, res) {


	  if (!_.has(req.body, 'hostId', 'type', 'content')) {
	    return res.json({error: "LOST_PARAM"})
	  }

	  db.host.findOne({_id: req.body.hostId}, function(err, host){
	    if (err) return res.json({error: "EXCEPTION_ERROR"})
	    if (!host) return res.json({error: "NOT_FOUND"})
	    req.body.type = req.body.type || 'html'
	    if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)

	    db.cname.insert(req.body, function(err, doc){
	      if (err) return res.send({error: "EXCEPTION_ERROR"})
	      res.json(doc)
	    })
	  })

	}



	/** 获取详情 **/
	cnameController.detail = function(req, res, next) {

	  if (!_.has(req.body, 'hostId', 'cnameId')) return res.json({error: "LOST_PARAM"})

	  async.parallel([
	    function(callback){
	      db.host.findOne({_id: req.body.hostId}, callback)
	    }, function(callback){
	      db.cname.findOne({_id: req.body.cnameId}, callback)
	    }
	  ], function(err, results){
	    if (err) return res.json({error: "EXCEPTION_ERROR"})
	    return res.json({
	      host: results[0],
	      cname: results[1]
	    })

	  })
	}





	/**
	 * 更新已有的记录
	 * @param req
	 * @param res
	 */
	cnameController.cnameUpdate = function(req, res) {
	  var App = model('App')
	  var User = model('User')
	  var Cname = model('Cname')

	  if (!_.has(req.body, 'hostId', 'type', 'content', 'pathname')) return res.json({error: "PARAMS_LOST"})

	  if (req.body.type == 'html') req.body.content = ent.encode(req.body.content)
	  req.body.pathname = req.body.pathname.toString()

	  Cname.findOneAndUpdate({hostId: req.body.hostId}, req.body, function(err, cname){

	    if (err) return res.send({error: 'EXCEPTION_ERROR'})
	    if (!cname) return res.json({error: "NOT_FOUND"})

	    res.json(_.omit(cname.toObject(), ['_id', '__v']))

	  })


	}


	/**
	 * 获取cname列表
	 */
	cnameController.cnameListRead = function(req, res, next) {
	  var App = model('App')
	  var User = model('User')
	  var Cname = model('Cname')

	  Cname.find({userId: req.user.userId}, function(err, list){
	    if (err) return res.send({error: "EXCEPTION_ERROR"})
	    res.json({list: list})
	  })

	}

	/**
	 * 删除一个cname
	 */

	cnameController.delete = function(req, res, next) {

	  db.cname.remove({cnameId: req.body.cnameId}, function(err){
	    if (err) return res.json({error: 'EXCEPTION_ERROR'})
	    res.json({})
	  })

	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var hostController = module.exports = {}
	var conf = __webpack_require__(15)
	var db = __webpack_require__(16)
	var _ = __webpack_require__(13)


	/** 创建一条host记录 **/
	hostController.new = function(req, res, next) {


	  if (!_.has(req.body, 'hostname')) {
	    return res.json({error: "LOST_PARAM"})
	  }

	  if (_.trim(req.body.hostname) == '') {
	    return res.json({error: "ILLEGAL_PARAM"})
	  }

	  db.host.findOne({hostname: req.body.hostname}, function(err, item){
	    if (err) return res.json({error: "EXCEPTION_ERROR"})
	    if (item) return res.json({error: "PERMISSION_DENIED", message: "域名已存在"})

	    db.host.insert({
	      hostname: req.body.hostname
	    }, function(err, item){
	      if (err) return res.json({error: "EXCEPTION_ERROR"})
	      res.json(item)
	    })


	  })

	}




	/**
	 * 获取域名详
	 */
	hostController.detail = function(req, res, next) {

	  if (!_.has(req.body, 'hostId')) {
	    return res.json({error: "LOST_PARAM"})
	  }

	  var result = {}

	  db.host.findOne({_id: req.body.hostId}, function(err, item){
	    if (err) return res.json({error: "EXCEPTION_ERROR"})
	    if (!item) return res.json({error: "NOT_FOUND"})
	    result.host = item

	    db.cname.find({hostId: req.body.hostId}, function(err, docs){
	      if (err) return res.json({error: 'EXCEPTION_ERROR'})
	      result.list = docs
	      res.json(result)
	    })

	  })

	}



	/**
	 * 删除某个域名
	 */
	hostController.delete = function(req, res, next) {

	  if (!_.has(req.body, 'hostId')) return res.json({error: "PERMISSION_DENIED"})

	  async.parallel([
	    function(callback){
	      return db.host.remove({_id: req.body.hostId}, {}, callback)
	    }, function(callback){
	      return db.cname.remove({hostId: req.body.hostId}, {multi: true}, callback)
	    }
	  ], function(err, result){
	    if (err) return res.json({error: "EXCEPTION_ERROR"})
	    return res.json({result: result})
	  })

	}

	/**
	 * 获取域名列表
	 */
	hostController.list = function(req, res, next) {

	  //var Host = model('Host')
	  //
	  //Host.find({userId: req.user.userId}, function(err, list){
	  //  if (err) return res.json({error: "EXCEPTION_ERROR"})
	  //  res.json({list: list})
	  //})

	  db.host.find({}, function(err, docs){
	    if(err) return res.json({error: 'EXCEPTION_ERROR'})
	    res.json({list: docs})
	  })

	}

	/**
	 * 编辑host
	 * @param req
	 * @param ers
	 * @param next
	 */
	hostController.edit = function (req, res, next) {
	  res.json({error: "API_BUILDING"})
	}

/***/ }
/******/ ]);