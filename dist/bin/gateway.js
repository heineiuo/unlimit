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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _express = __webpack_require__(5);

	var _express2 = _interopRequireDefault(_express);

	var _http = __webpack_require__(6);

	var _http2 = _interopRequireDefault(_http);

	var _autoSni = __webpack_require__(7);

	var _autoSni2 = _interopRequireDefault(_autoSni);

	var _seashell = __webpack_require__(8);

	var _seashell2 = _interopRequireDefault(_seashell);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _http3 = __webpack_require__(13);

	var _http4 = _interopRequireDefault(_http3);

	var _gateway = __webpack_require__(51);

	var _gateway2 = _interopRequireDefault(_gateway);

	var _service = __webpack_require__(55);

	var _service2 = _interopRequireDefault(_service);

	var _account = __webpack_require__(56);

	var _account2 = _interopRequireDefault(_account);

	var _db = __webpack_require__(65);

	var _init = __webpack_require__(69);

	var _init2 = _interopRequireDefault(_init);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var start = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
	    return _regenerator2.default.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _context2.prev = 0;
	            return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
	              var db, basedb, isInitInDB, initdata, dbdata, app, server, hub;
	              return _regenerator2.default.wrap(function _callee$(_context) {
	                while (1) {
	                  switch (_context.prev = _context.next) {
	                    case 0:
	                      db = (0, _db.opendb)(_config2.default.datadir + '/db');
	                      basedb = (0, _db.promisifydb)((0, _db.subdb)(db, 'base'));
	                      isInitInDB = false;
	                      initdata = (0, _assign2.default)({}, _config2.default.production.init);
	                      _context.prev = 4;
	                      _context.next = 7;
	                      return basedb.get('init');

	                    case 7:
	                      dbdata = _context.sent;

	                      isInitInDB = true;
	                      initdata = dbdata;

	                      _context.next = 20;
	                      break;

	                    case 12:
	                      _context.prev = 12;
	                      _context.t0 = _context['catch'](4);

	                      if (_context.t0.name == 'NotFoundError') isInitInDB = false;
	                      _context.next = 17;
	                      return basedb.put('init', initdata);

	                    case 17:
	                      console.log('[gateway] Running init.');
	                      _context.next = 20;
	                      return (0, _init2.default)(db, initdata);

	                    case 20:

	                      if (isInitInDB) {
	                        console.log('[gateway] Init data has been found, init in production.json will be ignore.');
	                      } else {
	                        console.log('[gateway] Use initdata in production.json');
	                      }

	                      app = (0, _express2.default)();
	                      server = _http2.default.createServer(app);
	                      hub = new _seashell2.default(db, server);


	                      hub.integrate({ name: 'gateway', router: (0, _gateway2.default)((0, _db.subdb)(db, 'gateway')) });
	                      hub.integrate({ name: 'service', router: (0, _service2.default)((0, _db.subdb)(db, 'service'), hub.handler) });
	                      hub.integrate({ name: 'account', router: (0, _account2.default)((0, _db.subdb)(db, 'account')) });

	                      app.use(function (req, res, next) {
	                        res.gateway = hub.integrations.gateway;
	                        next();
	                      });

	                      app.use((0, _http4.default)(db, _config2.default));

	                      (0, _autoSni2.default)({
	                        email: _config2.default.production.https.email,
	                        agreeTos: true,
	                        debug: _config2.default.production.https.debug,
	                        domains: _config2.default.production.https.domains,
	                        forceSSL: false,
	                        redirectCode: 301,
	                        ports: {
	                          http: 80,
	                          https: 443
	                        }
	                      }, app).once("listening", function () {
	                        return console.log("[gateway] Listening on port 443 and 80.");
	                      });

	                    case 30:
	                    case 'end':
	                      return _context.stop();
	                  }
	                }
	              }, _callee, undefined, [[4, 12]]);
	            })(), 't0', 2);

	          case 2:
	            _context2.next = 8;
	            break;

	          case 4:
	            _context2.prev = 4;
	            _context2.t1 = _context2['catch'](0);

	            console.log(_context2.t1.stack);
	            process.cwd(1);

	          case 8:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, undefined, [[0, 4]]);
	  }));

	  return function start() {
	    return _ref.apply(this, arguments);
	  };
	}();

	start();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/regenerator");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/assign");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("auto-sni");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("seashell");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _os = __webpack_require__(10);

	var _os2 = _interopRequireDefault(_os);

	var _fs = __webpack_require__(11);

	var _fs2 = _interopRequireDefault(_fs);

	var _yargs = __webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = (0, _assign2.default)({
	  debug: false,
	  datadir: _os2.default.homedir() + '/data/gateway'
	}, _yargs.argv);

	config.production = JSON.parse(_fs2.default.readFileSync(config.datadir + '/production.json', 'utf-8'));

	// console.log(config);

	exports.default = config;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("yargs");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _morgan = __webpack_require__(14);

	var _morgan2 = _interopRequireDefault(_morgan);

	var _compression = __webpack_require__(15);

	var _compression2 = _interopRequireDefault(_compression);

	var _express = __webpack_require__(5);

	var _express2 = _interopRequireDefault(_express);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createApp = function createApp(db, config) {
	  var app = (0, _express2.default)();

	  app.use((0, _morgan2.default)(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
	  app.use((0, _compression2.default)());
	  app.use(function (req, res, next) {
	    res.removeHeader("x-powered-by");
	    // res.locals.seashell = seashell;
	    next();
	  });
	  app.use(__webpack_require__(16)(config));
	  app.use(__webpack_require__(18)(db, config));

	  app.use(function (err, req, res, next) {
	    console.log(err);
	    res.json({ error: err.msg });
	  });

	  app.use(function (req, res) {
	    res.status(404);
	    res.end('NOT FOUND \n SEASHELL SERVER.');
	  });

	  return app;

	  // app.listen(80, () => console.log('Listening on port 80'));
	  // require('./acme/raw')(config, app, () => console.log('Listening on port 443'))
	}; /**
	    * Copyright 2015 - 2016 heineiuo <heineiuo@gmail.com>
	    * @provideModule httpStart
	    */
	exports.default = createApp;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _uaParserJs = __webpack_require__(17);

	var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var redirectToHttps = function redirectToHttps(config) {
	  return function (req, res, next) {
	    // if (config.production.https.length == 0) {
	    //   if ( req.protocol == 'https' ) {
	    //     return res.redirect(`http://${req.headers.host}${req.originalUrl}`)
	    //   }
	    //   return next()
	    // }
	    if (config.production.https.approvedDomains.indexOf(req.headers.host) == -1) return next();
	    if (req.protocol == 'https') return next();
	    var browser = new _uaParserJs2.default().setUA(req.headers['user-agent']).getBrowser();
	    if (config.debug) console.log(browser);
	    if (browser.name == 'IE' && Number(browser.major) < 9) return next();
	    res.redirect('https://' + req.headers.host + req.originalUrl);
	  };
	};

	module.exports = redirectToHttps;

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("ua-parser-js");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _stringify = __webpack_require__(19);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _values = __webpack_require__(20);

	var _values2 = _interopRequireDefault(_values);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _express = __webpack_require__(5);

	var _url = __webpack_require__(22);

	var _url2 = _interopRequireDefault(_url);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var pickLocation = function pickLocation(locations, requrl) {
	  return new _promise2.default(function (resolve, reject) {
	    try {
	      (function () {
	        var sortedLocations = (0, _values2.default)(locations).sort(function (a, b) {
	          return a.sort > b.sort;
	        });
	        var url = _url2.default.parse(requrl);

	        console.log(sortedLocations);

	        /**
	         * 通过比对pathname, 找到路由
	         */
	        var found = false;
	        sortedLocations.some(function (item) {
	          var reg = new RegExp(item.pathname.substr(1, item.pathname.length - 2).replace('\\\\', '\\'));
	          var matches = url.pathname.match(reg);
	          if (matches && matches[0] == url.pathname) {
	            item.type = item.type.toUpperCase();
	            // res.locals.host = doc;
	            // res.locals.location = item;
	            found = true;
	            resolve({
	              url: url,
	              location: item
	            });
	          }
	          return found;
	        });

	        if (!found) {
	          resolve({
	            url: url,
	            location: {
	              pathname: '/^.*$/',
	              type: 'FILE'
	            }
	          });
	        }
	      })();
	    } catch (e) {
	      reject(new Error('LOCATION_NOT_FOUND'));
	    }
	  });
	};

	module.exports = function (db, config) {

	  var router = (0, _express.Router)();

	  var handler = (0, _sprucejs.combineReducers)([__webpack_require__(24), __webpack_require__(30)])(db);

	  /**
	   * 查询host
	   */
	  router.use(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var host, doc, list, locations, _ref2, location, url, value;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;


	              /**e
	               * 查找host及其location列表
	               */
	              host = req.headers.host;

	              console.log('[gateway] searching host');
	              _context.next = 5;
	              return handler({ reducerName: 'host', hostname: host, action: 'Get' });

	            case 5:
	              doc = _context.sent;

	              console.log('doc: ' + (0, _stringify2.default)(doc));
	              _context.next = 9;
	              return handler({ reducerName: 'location', hostname: host, action: 'list' });

	            case 9:
	              list = _context.sent;
	              locations = list.location.locations;

	              console.log('locations: ' + (0, _stringify2.default)(locations));
	              _context.next = 14;
	              return pickLocation(locations, req.url);

	            case 14:
	              _ref2 = _context.sent;
	              location = _ref2.location;
	              url = _ref2.url;


	              console.log(location);
	              res.locals.host = doc;
	              res.locals.url = url;
	              res.locals.location = location;
	              if (location.cors) {
	                res.set('Access-Control-Allow-Origin', '*');
	                res.set('Access-Control-Expose-Headers', '*');
	                res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
	                res.set('Access-Control-Allow-Methods', '*');
	              }

	              if (location['X-Frame-Options']) {
	                value = location['X-Frame-Options'] || 'SAMEORIGIN';

	                res.set("X-Frame-Options", value);
	              }

	              next();
	              _context.next = 29;
	              break;

	            case 26:
	              _context.prev = 26;
	              _context.t0 = _context['catch'](0);

	              next(_context.t0);

	            case 29:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 26]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  router.use(__webpack_require__(35));
	  router.use(__webpack_require__(42));
	  router.use(__webpack_require__(43));
	  router.use(__webpack_require__(45));
	  router.use(__webpack_require__(46));
	  router.use(__webpack_require__(47));
	  router.use(__webpack_require__(48));
	  router.use(__webpack_require__(49));
	  router.use(__webpack_require__(50));

	  /**
	   * TODO DEPRECATED
	   * `api`是唯一一个自带路由的
	   * 或许目前没有方法让用户自定义这一块的路由
	   */
	  // routes.use(require('./api'))

	  /**
	   * 未定义的type类型
	   */
	  router.use(function (req, res, next) {
	    next('ILLEGAL_HTTP_REQUEST');
	  });

	  /**
	   * 处理proxy内遇到的异常和错误
	   * `HOST_NOT_FOUND` 即没有错误, 交给http_server
	   * `LOCATION_NOT_FOUND` 即404
	   * `UNDEFINED_TYPE` 用户非法请求
	   *
	   * 其他 err交给全局err处理器
	   */
	  router.use(function () {
	    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(err, req, res, next) {
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              console.log(err.stack);

	              if (!(err.message == 'HOST_NOT_FOUND')) {
	                _context2.next = 3;
	                break;
	              }

	              return _context2.abrupt('return', next());

	            case 3:
	              if (!(err.message == 'LOCATION_NOT_FOUND')) {
	                _context2.next = 5;
	                break;
	              }

	              return _context2.abrupt('return', res.end(req.headers.host + ': LOCATION NOT FOUND'));

	            case 5:
	              if (!(err.message == 'UNDEFINED_TYPE')) {
	                _context2.next = 7;
	                break;
	              }

	              return _context2.abrupt('return', res.end(req.headers.host + ': CONFIGURE ERROR'));

	            case 7:
	              if (!(err.message == 'NOT_FOUND')) {
	                _context2.next = 9;
	                break;
	              }

	              return _context2.abrupt('return', next());

	            case 9:
	              return _context2.abrupt('return', res.end(req.headers.host + ': EXCEPTION ERROR'));

	            case 10:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined);
	    }));

	    return function (_x4, _x5, _x6, _x7) {
	      return _ref3.apply(this, arguments);
	    };
	  }());

	  return router;
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/json/stringify");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/values");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/promise");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = require("sprucejs");

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	var _joi = __webpack_require__(29);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Host = function (_Model) {
	  (0, _inherits3.default)(Host, _Model);

	  function Host() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Host);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Host.__proto__ || (0, _getPrototypeOf2.default)(Host)).call.apply(_ref, [this].concat(args))), _this), _this.detail = function (req) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var _this$props, db, reducers, hostname, host;

	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  _this$props = _this.props, db = _this$props.db, reducers = _this$props.reducers;
	                  hostname = req.hostname;
	                  _context.next = 6;
	                  return _this.Get(hostname);

	                case 6:
	                  host = _context.sent;

	                  resolve({ host: host });
	                  _context.next = 13;
	                  break;

	                case 10:
	                  _context.prev = 10;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 13:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 10]]);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.list = function (req) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var db, list;
	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.prev = 0;
	                  db = _this.props.db;
	                  _context2.next = 4;
	                  return db.find({});

	                case 4:
	                  list = _context2.sent;

	                  resolve({ list: list });
	                  _context2.next = 11;
	                  break;

	                case 8:
	                  _context2.prev = 8;
	                  _context2.t0 = _context2['catch'](0);

	                  reject(_context2.t0);

	                case 11:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2, [[0, 8]]);
	        }));

	        return function (_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _this.Delete = function (req) {
	      return new _promise2.default(function () {
	        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	          var _this$props2, db, reducers, hostname;

	          return _regenerator2.default.wrap(function _callee3$(_context3) {
	            while (1) {
	              switch (_context3.prev = _context3.next) {
	                case 0:
	                  _context3.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  _this$props2 = _this.props, db = _this$props2.db, reducers = _this$props2.reducers;
	                  hostname = req.hostname;
	                  _context3.next = 6;
	                  return _promise2.default.all([db.del(hostname), reducers.Location.destroy(hostname)]);

	                case 6:
	                  resolve({});
	                  _context3.next = 12;
	                  break;

	                case 9:
	                  _context3.prev = 9;
	                  _context3.t0 = _context3['catch'](0);

	                  reject(_context3.t0);

	                case 12:
	                case 'end':
	                  return _context3.stop();
	              }
	            }
	          }, _callee3, _this2, [[0, 9]]);
	        }));

	        return function (_x5, _x6) {
	          return _ref4.apply(this, arguments);
	        };
	      }());
	    }, _this.New = function (query) {
	      return new _promise2.default(function () {
	        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	          var hostname, _this$props3, db, reducers;

	          return _regenerator2.default.wrap(function _callee4$(_context4) {
	            while (1) {
	              switch (_context4.prev = _context4.next) {
	                case 0:
	                  _context4.prev = 0;

	                  _joi2.default.validate(query, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  hostname = query.hostname;
	                  _this$props3 = _this.props, db = _this$props3.db, reducers = _this$props3.reducers;
	                  _context4.next = 6;
	                  return _this.ShouldNotFound(hostname);

	                case 6:
	                  _context4.next = 8;
	                  return db.put(hostname, { hostname: hostname });

	                case 8:
	                  _context4.next = 10;
	                  return reducers.Location.batch({ hostname: hostname, locations: {}, reset: true });

	                case 10:
	                  _context4.next = 12;
	                  return reducers.File.initHostDir(hostname);

	                case 12:
	                  resolve({ hostname: hostname });
	                  _context4.next = 18;
	                  break;

	                case 15:
	                  _context4.prev = 15;
	                  _context4.t0 = _context4['catch'](0);

	                  reject(_context4.t0);

	                case 18:
	                case 'end':
	                  return _context4.stop();
	              }
	            }
	          }, _callee4, _this2, [[0, 15]]);
	        }));

	        return function (_x7, _x8) {
	          return _ref5.apply(this, arguments);
	        };
	      }());
	    }, _this.Get = function (key) {
	      return new _promise2.default(function () {
	        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	          var db, host;
	          return _regenerator2.default.wrap(function _callee5$(_context5) {
	            while (1) {
	              switch (_context5.prev = _context5.next) {
	                case 0:
	                  _context5.prev = 0;
	                  db = _this.props.db;
	                  _context5.next = 4;
	                  return db.get(key);

	                case 4:
	                  host = _context5.sent;

	                  // console.log('host: '+ JSON.stringify(host));
	                  resolve(host);
	                  _context5.next = 13;
	                  break;

	                case 8:
	                  _context5.prev = 8;
	                  _context5.t0 = _context5['catch'](0);

	                  if (!(_context5.t0.name == 'NotFoundError')) {
	                    _context5.next = 12;
	                    break;
	                  }

	                  return _context5.abrupt('return', reject(new Error('HOST_NOT_FOUND')));

	                case 12:
	                  reject(_context5.t0);

	                case 13:
	                case 'end':
	                  return _context5.stop();
	              }
	            }
	          }, _callee5, _this2, [[0, 8]]);
	        }));

	        return function (_x9, _x10) {
	          return _ref6.apply(this, arguments);
	        };
	      }());
	    }, _this.ShouldNotFound = function (key) {
	      return new _promise2.default(function () {
	        var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(resolve, reject) {
	          var db;
	          return _regenerator2.default.wrap(function _callee6$(_context6) {
	            while (1) {
	              switch (_context6.prev = _context6.next) {
	                case 0:
	                  _context6.prev = 0;
	                  db = _this.props.db;
	                  _context6.next = 4;
	                  return db.get(key);

	                case 4:
	                  reject(new Error('HOST_EXIST'));
	                  _context6.next = 12;
	                  break;

	                case 7:
	                  _context6.prev = 7;
	                  _context6.t0 = _context6['catch'](0);

	                  if (!(_context6.t0.name == 'NotFoundError')) {
	                    _context6.next = 11;
	                    break;
	                  }

	                  return _context6.abrupt('return', resolve());

	                case 11:
	                  reject(_context6.t0);

	                case 12:
	                case 'end':
	                  return _context6.stop();
	              }
	            }
	          }, _callee6, _this2, [[0, 7]]);
	        }));

	        return function (_x11, _x12) {
	          return _ref7.apply(this, arguments);
	        };
	      }());
	    }, _this.resolve = function (req) {
	      var action = req.action;

	      if (action == 'Get') return _this.Get(req.hostname);
	      if (action == 'New') return _this.New(req);
	      if (action == 'Delete') return _this.Delete(req);
	      if (action == 'list') return _this.list(req);
	      if (action == 'detail') return _this.detail(req);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('NOT_FOUND'));
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * @api {POST} /Host/detail 获取域名详情
	   * @apiGroup Host
	   * @apiName HostDetail
	   * @apiParam {string} hostname
	   * @apiSuccess {object} host
	   */


	  /**
	   * @api {POST} /host/list 获取域名列表
	   * @apiGroup Host
	   * @apiName HostList
	   * @apiParam {number} limit 个数限制
	   * @apiSuccess {string} list
	   */


	  /**
	   * @api {POST} /Host/delete删除host
	   * @apiGroup Host
	   * @apiName HostDelete
	   * @apiParam {string} hostname
	   */


	  /**
	   * @api {POST} /Host/new 创建新的域名
	   * @apiGroup Host
	   * @apiName HostNew
	   * @apiParam {string} hostname
	   * @apiSuccess {string} hostname
	   */


	  return Host;
	}(_sprucejs.Model);

	module.exports = Host;

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/inherits");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("joi");

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(31);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _values = __webpack_require__(20);

	var _values2 = _interopRequireDefault(_values);

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _keys = __webpack_require__(32);

	var _keys2 = _interopRequireDefault(_keys);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(33);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	var _joi = __webpack_require__(29);

	var _joi2 = _interopRequireDefault(_joi);

	var _ent = __webpack_require__(34);

	var _ent2 = _interopRequireDefault(_ent);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Location = function (_Model) {
	  (0, _inherits3.default)(Location, _Model);

	  function Location() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Location);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Location.__proto__ || (0, _getPrototypeOf2.default)(Location)).call.apply(_ref, [this].concat(args))), _this), _this.New = function (req) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var _this$props, db, reducers, hostname, type, _req$cors, cors, pathname, content, _req$contentType, contentType, encodedContent, location, nextLocation;

	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required(),
	                    pathname: _joi2.default.string().required(),
	                    cors: _joi2.default.boolean(),
	                    type: _joi2.default.string().required(),
	                    contentType: _joi2.default.string(),
	                    content: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  _this$props = _this.props, db = _this$props.db, reducers = _this$props.reducers;
	                  hostname = req.hostname, type = req.type, _req$cors = req.cors, cors = _req$cors === undefined ? false : _req$cors, pathname = req.pathname, content = req.content, _req$contentType = req.contentType, contentType = _req$contentType === undefined ? 'text' : _req$contentType;
	                  _context.next = 6;
	                  return reducers.Host.Get(hostname);

	                case 6:
	                  encodedContent = type == 'html' ? _ent2.default.encode(content) : content;
	                  _context.next = 9;
	                  return db.get(hostname);

	                case 9:
	                  location = _context.sent;
	                  nextLocation = {
	                    pathname: pathname,
	                    cors: cors,
	                    sort: (0, _keys2.default)(location.locations).length + 1,
	                    type: type,
	                    contentType: contentType,
	                    content: encodedContent
	                  };


	                  location.locations[pathname] = nextLocation;
	                  _context.next = 14;
	                  return db.put(hostname, location);

	                case 14:
	                  resolve({ nextLocation: nextLocation });
	                  _context.next = 20;
	                  break;

	                case 17:
	                  _context.prev = 17;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 20:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 17]]);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.list = function (req) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var _this$props2, db, reducers, hostname, Host, host, location;

	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  _this$props2 = _this.props, db = _this$props2.db, reducers = _this$props2.reducers;
	                  hostname = req.hostname;
	                  Host = _this.props.reducers.Host;
	                  _context2.next = 7;
	                  return Host.Get(hostname);

	                case 7:
	                  host = _context2.sent;
	                  _context2.next = 10;
	                  return db.get(hostname);

	                case 10:
	                  location = _context2.sent;

	                  resolve({ host: host, location: location });
	                  _context2.next = 17;
	                  break;

	                case 14:
	                  _context2.prev = 14;
	                  _context2.t0 = _context2['catch'](0);

	                  reject(_context2.t0);

	                case 17:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2, [[0, 14]]);
	        }));

	        return function (_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _this.edit = function (req) {
	      return new _promise2.default(function () {
	        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	          var _this$props3, db, reducers, cors, hostname, type, content, contentType, pathname, nextContent, location;

	          return _regenerator2.default.wrap(function _callee3$(_context3) {
	            while (1) {
	              switch (_context3.prev = _context3.next) {
	                case 0:
	                  _context3.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required(),
	                    pathname: _joi2.default.string().required(),
	                    cors: _joi2.default.boolean(),
	                    type: _joi2.default.string(),
	                    contentType: _joi2.default.string(),
	                    content: _joi2.default.string()
	                  }), { allowUnknown: true });

	                  _this$props3 = _this.props, db = _this$props3.db, reducers = _this$props3.reducers;
	                  cors = req.cors, hostname = req.hostname, type = req.type, content = req.content, contentType = req.contentType, pathname = req.pathname;
	                  nextContent = type == 'html' && contentType == 'text' ? _ent2.default.encode(content) : content;
	                  _context3.next = 7;
	                  return db.get(hostname);

	                case 7:
	                  location = _context3.sent;

	                  location.locations[pathname] = {
	                    pathname: pathname,
	                    cors: cors,
	                    sort: location.locations[pathname].sort,
	                    type: type,
	                    contentType: contentType,
	                    content: nextContent
	                  };
	                  _context3.next = 11;
	                  return db.put(hostname, location);

	                case 11:
	                  resolve({ success: 1 });
	                  _context3.next = 17;
	                  break;

	                case 14:
	                  _context3.prev = 14;
	                  _context3.t0 = _context3['catch'](0);

	                  reject(_context3.t0);

	                case 17:
	                case 'end':
	                  return _context3.stop();
	              }
	            }
	          }, _callee3, _this2, [[0, 14]]);
	        }));

	        return function (_x5, _x6) {
	          return _ref4.apply(this, arguments);
	        };
	      }());
	    }, _this.Delete = function (req) {
	      return new _promise2.default(function () {
	        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	          var _this$props4, db, reducers, hostname, pathname, location;

	          return _regenerator2.default.wrap(function _callee4$(_context4) {
	            while (1) {
	              switch (_context4.prev = _context4.next) {
	                case 0:
	                  _context4.prev = 0;

	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required(),
	                    pathname: _joi2.default.string().required()
	                  }), { allowUnknown: true });

	                  _this$props4 = _this.props, db = _this$props4.db, reducers = _this$props4.reducers;
	                  hostname = req.hostname, pathname = req.pathname;
	                  _context4.next = 6;
	                  return db.get(hostname);

	                case 6:
	                  location = _context4.sent;

	                  delete location.locations[pathname];
	                  _context4.next = 10;
	                  return db.put(hostname, location);

	                case 10:
	                  resolve({});
	                  _context4.next = 16;
	                  break;

	                case 13:
	                  _context4.prev = 13;
	                  _context4.t0 = _context4['catch'](0);

	                  reject(_context4.t0);

	                case 16:
	                case 'end':
	                  return _context4.stop();
	              }
	            }
	          }, _callee4, _this2, [[0, 13]]);
	        }));

	        return function (_x7, _x8) {
	          return _ref5.apply(this, arguments);
	        };
	      }());
	    }, _this.destroy = function (hostname) {
	      var db = _this.props.db;

	      return db.del(hostname);
	    }, _this.batch = function (req) {
	      return new _promise2.default(function () {
	        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	          var _this$props5, db, reducers, hostname, locations, _req$reset, reset, location;

	          return _regenerator2.default.wrap(function _callee5$(_context5) {
	            while (1) {
	              switch (_context5.prev = _context5.next) {
	                case 0:
	                  _context5.prev = 0;


	                  _joi2.default.validate(req, _joi2.default.object().keys({
	                    hostname: _joi2.default.string().required(),
	                    locations: _joi2.default.object().required()
	                  }), { allowUnknown: true });

	                  _this$props5 = _this.props, db = _this$props5.db, reducers = _this$props5.reducers;
	                  hostname = req.hostname, locations = req.locations, _req$reset = req.reset, reset = _req$reset === undefined ? false : _req$reset;
	                  _context5.next = 6;
	                  return reducers.Host.Get(hostname);

	                case 6:
	                  if (!reset) {
	                    _context5.next = 11;
	                    break;
	                  }

	                  _context5.next = 9;
	                  return db.put(hostname, { hostname: hostname, locations: locations });

	                case 9:
	                  _context5.next = 17;
	                  break;

	                case 11:
	                  _context5.next = 13;
	                  return db.get(hostname);

	                case 13:
	                  location = _context5.sent;

	                  location.locations = locations;
	                  _context5.next = 17;
	                  return db.put(hostname, location);

	                case 17:
	                  resolve({});
	                  _context5.next = 23;
	                  break;

	                case 20:
	                  _context5.prev = 20;
	                  _context5.t0 = _context5['catch'](0);

	                  reject(_context5.t0);

	                case 23:
	                case 'end':
	                  return _context5.stop();
	              }
	            }
	          }, _callee5, _this2, [[0, 20]]);
	        }));

	        return function (_x9, _x10) {
	          return _ref6.apply(this, arguments);
	        };
	      }());
	    }, _this.UpdateSort = function (req) {
	      return new _promise2.default(function () {
	        var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(resolve, reject) {
	          var _ret2;

	          return _regenerator2.default.wrap(function _callee7$(_context7) {
	            while (1) {
	              switch (_context7.prev = _context7.next) {
	                case 0:
	                  _context7.prev = 0;
	                  return _context7.delegateYield(_regenerator2.default.mark(function _callee6() {
	                    var _this$props6, db, reducers, nextSort, pathname, hostname, location, targetPath, prevSort, beBigger;

	                    return _regenerator2.default.wrap(function _callee6$(_context6) {
	                      while (1) {
	                        switch (_context6.prev = _context6.next) {
	                          case 0:
	                            _joi2.default.validate(req, _joi2.default.object().keys({
	                              hostname: _joi2.default.string().required(),
	                              pathname: _joi2.default.string().required(),
	                              nextSort: _joi2.default.number().required()
	                            }), { allowUnknown: true });

	                            _this$props6 = _this.props, db = _this$props6.db, reducers = _this$props6.reducers;
	                            nextSort = req.nextSort, pathname = req.pathname, hostname = req.hostname;

	                            if (!(nextSort < 1)) {
	                              _context6.next = 5;
	                              break;
	                            }

	                            return _context6.abrupt('return', {
	                              v: reject('PARAMS_ILLEGAL')
	                            });

	                          case 5:
	                            _context6.next = 7;
	                            return db.get(hostname);

	                          case 7:
	                            location = _context6.sent;
	                            targetPath = location.locations[pathname];
	                            prevSort = targetPath.sort;

	                            if (!(nextSort == prevSort)) {
	                              _context6.next = 12;
	                              break;
	                            }

	                            return _context6.abrupt('return', {
	                              v: reject(new Error('NOT_CHANGED'))
	                            });

	                          case 12:
	                            beBigger = nextSort > prevSort;

	                            if (!(nextSort > (0, _keys2.default)(location.locations).length)) {
	                              _context6.next = 15;
	                              break;
	                            }

	                            return _context6.abrupt('return', {
	                              v: reject(new Error('PARAMS_ILLEGAL'))
	                            });

	                          case 15:

	                            location.locations[pathname].sort = nextSort;
	                            (0, _values2.default)(location.locations).forEach(function (item) {
	                              /**
	                               * 变大的话, 比之前大的和比现在小的都要变小, 包括目标sort
	                               * 变小的话, 比之前小的和比现在大的都要变大, 包括目标sort
	                               */
	                              if (item.pathname == pathname) return false;
	                              if (beBigger && item.sort > prevSort && item.sort <= nextSort) {
	                                return location.locations[item.pathname].sort--;
	                              }
	                              if (!beBigger && item.sort >= nextSort && item.sort < prevSort) {
	                                return location.locations[item.pathname].sort++;
	                              }
	                            });
	                            _context6.next = 19;
	                            return db.put(hostname, location);

	                          case 19:
	                            resolve({ success: 1 });

	                          case 20:
	                          case 'end':
	                            return _context6.stop();
	                        }
	                      }
	                    }, _callee6, _this2);
	                  })(), 't0', 2);

	                case 2:
	                  _ret2 = _context7.t0;

	                  if (!((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object")) {
	                    _context7.next = 5;
	                    break;
	                  }

	                  return _context7.abrupt('return', _ret2.v);

	                case 5:
	                  _context7.next = 10;
	                  break;

	                case 7:
	                  _context7.prev = 7;
	                  _context7.t1 = _context7['catch'](0);

	                  reject(_context7.t1);

	                case 10:
	                case 'end':
	                  return _context7.stop();
	              }
	            }
	          }, _callee7, _this2, [[0, 7]]);
	        }));

	        return function (_x11, _x12) {
	          return _ref7.apply(this, arguments);
	        };
	      }());
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * @api {POST} /location/new 创建一条location记录
	   * @apiGroup Location
	   * @apiName LocationNew
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiParam {string} pathname
	   * @apiParam {boolean} cors
	   * @apiParam {string} type
	   * @apiParam {string} [contentType]
	   * @apiParam {string} content
	   */


	  /**
	   * @api {POST} /location/list 获取location列表
	   * @apiGroup Location
	   * @apiName LocationList
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiSuccess {object} host
	   * @apiSuccess {object} location
	   */


	  /**
	   * @api {POST} /Location/delete 删除一个location
	   * @apiGroup Location
	   * @apiName LocationDelete
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiParam {string} pathname
	   */


	  /**
	   * @api {POST} /location/batch 批量设置
	   * @apiGroup Location
	   * @apiName LocationBatch
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiParam {string} locations
	   * @apiSuccess {number} success
	   */


	  /**
	   * @api {POST} /location/updatesort 修改排序
	   * @apiGroup Location
	   * @apiName LocationUpdateSort
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiParam {string} pathname
	   * @apiParam {number} nextSort
	   * @apiSuccess {number} success
	   */


	  (0, _createClass3.default)(Location, [{
	    key: 'resolve',
	    value: function resolve(req) {
	      var action = req.action;

	      if (action == 'UpdateSort') return this.UpdateSort(req);
	      if (action == 'batch') return this.batch(req);
	      if (action == 'Delete') return this.Delete(req);
	      if (action == 'edit') return this.edit(req);
	      if (action == 'list') return this.list(req);
	      if (action == 'New') return this.New(req);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('NOT_FOUND'));
	      });
	    }
	  }]);
	  return Location;
	}(_sprucejs.Model);

	Location.valueTypes = {
	  pathname: String,
	  cors: Boolean,
	  sort: Number,
	  type: String,
	  contentType: String,
	  content: String
	};


	module.exports = Location;

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/typeof");

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/createClass");

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = require("ent");

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _express = __webpack_require__(5);

	var _bodyParser = __webpack_require__(36);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = (0, _express.Router)();

	var JSONSafeParse = function JSONSafeParse(content, schema) {
	  try {
	    return JSON.parse(content);
	  } catch (e) {
	    return (0, _assign2.default)({}, schema, {
	      JSONSafeParseError: e
	    });
	  }
	};

	router.use(function (req, res, next) {
	  var location = res.locals.location;

	  if (location.type == 'SEASHELL') return next();
	  return next(new Error('NOT_SEASHELL'));
	});

	router.use(_bodyParser2.default.urlencoded({ extended: true }));
	router.use(_bodyParser2.default.json());
	router.use(_bodyParser2.default.json({ type: 'application/*+json' }));
	router.use(_bodyParser2.default.json({ type: 'text/html' }));
	router.use(_bodyParser2.default.json({ type: 'text/plain' }));

	router.use(function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var gateway, _res$locals, host, url, location, data, importAppName;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            gateway = res.gateway;
	            _res$locals = res.locals, host = _res$locals.host, url = _res$locals.url, location = _res$locals.location;
	            data = (0, _assign2.default)({}, req.query, req.body, {
	              __GATEWAY: { host: host, url: url },
	              __METHOD: req.method
	            });
	            importAppName = location.content.search('{') != 0 ? location.content : url.pathname.search('account') > 0 ? 'account' : 'gateway';
	            _context.next = 7;
	            return gateway.request(importAppName, data);

	          case 7:
	            res.locals.seashellResult = _context.sent;

	            next();
	            _context.next = 15;
	            break;

	          case 11:
	            _context.prev = 11;
	            _context.t0 = _context['catch'](0);

	            if (_config2.default.debug) console.log(_context.t0.stack || _context.t0);
	            next(_context.t0);

	          case 15:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 11]]);
	  }));

	  return function (_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}());

	router.use(__webpack_require__(37));
	router.use(__webpack_require__(41));

	router.use(function (req, res, next) {
	  var seashellResult = res.locals.seashellResult;

	  res.json(seashellResult.body);
	});

	router.use(function (err, req, res, next) {
	  if (!err) return next();
	  if (err.message == 'NOT_SEASHELL') return next();
	  if (_config2.default.debug) console.log(err.stack || err);
	  res.json({ error: err.message });
	});

	module.exports = router;

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(31);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _formidable = __webpack_require__(38);

	var _formidable2 = _interopRequireDefault(_formidable);

	var _path = __webpack_require__(39);

	var _path2 = _interopRequireDefault(_path);

	var _fsPromise = __webpack_require__(40);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res, next) {
	    var _ret;

	    return _regenerator2.default.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.prev = 0;
	            return _context3.delegateYield(_regenerator2.default.mark(function _callee2() {
	              var seashellResult, _seashellResult$body, uploadDir, uploadLocation, uploadKey, uploaded, getPathPromises, result;

	              return _regenerator2.default.wrap(function _callee2$(_context2) {
	                while (1) {
	                  switch (_context2.prev = _context2.next) {
	                    case 0:
	                      seashellResult = res.locals.seashellResult;
	                      /**
	                       * 检查headers
	                       * 如果不是上传, 直接返回数据
	                       * 如果是上传, next()
	                       */

	                      if (seashellResult.headers.__UPLOAD) {
	                        _context2.next = 3;
	                        break;
	                      }

	                      return _context2.abrupt('return', {
	                        v: next()
	                      });

	                    case 3:

	                      /**
	                       * res.headers.__UPLOAD = true
	                       * res.body = {
	                       *  uploadKey: 'file',
	                       *  uploadDir: `/root/gateway/data/app/superuser.youkuohao.com/public/upload`,
	                       *  uploadLocation: `http://superuser.youkuohao.com/upload`
	                       * }
	                       **/
	                      _seashellResult$body = seashellResult.body, uploadDir = _seashellResult$body.uploadDir, uploadLocation = _seashellResult$body.uploadLocation, uploadKey = _seashellResult$body.uploadKey;

	                      /**
	                       * 设置上传参数, 处理上传, 返回上传结果 {fields, files}
	                       * @returns {Promise}
	                       */

	                      _context2.next = 6;
	                      return new _promise2.default(function (resolve, reject) {
	                        var form = new _formidable2.default.IncomingForm();
	                        form.encoding = 'utf-8';
	                        form.hash = 'md5';
	                        form.uploadDir = uploadDir;
	                        form.keepExtensions = true;
	                        form.multiples = true;

	                        form.parse(req, function (err, fields, files) {
	                          if (err) return reject(err);
	                          resolve({ fields: fields, files: files });
	                        });
	                      });

	                    case 6:
	                      uploaded = _context2.sent;

	                      /**
	                       * 上传后对文件进行处理
	                       * 注意, uploaded.files.fs 这里的`.fs` 是
	                       * 客户端传过来的formData的key, 可以改成其他的
	                       */
	                      getPathPromises = function getPathPromises() {
	                        var filesFile = uploaded.files[uploadKey];
	                        var fileList = filesFile.length > 0 ? filesFile : [filesFile];

	                        return fileList.map(function (file) {
	                          return new _promise2.default(function () {
	                            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	                              var fileName;
	                              return _regenerator2.default.wrap(function _callee$(_context) {
	                                while (1) {
	                                  switch (_context.prev = _context.next) {
	                                    case 0:
	                                      _context.prev = 0;
	                                      fileName = '' + file.hash + _path2.default.extname(file.name).toLowerCase();
	                                      _context.next = 4;
	                                      return _fsPromise2.default.rename(file.path, uploadDir + '/' + fileName);

	                                    case 4:
	                                      resolve(uploadLocation + '/' + fileName);
	                                      _context.next = 10;
	                                      break;

	                                    case 7:
	                                      _context.prev = 7;
	                                      _context.t0 = _context['catch'](0);

	                                      reject(_context.t0);

	                                    case 10:
	                                    case 'end':
	                                      return _context.stop();
	                                  }
	                                }
	                              }, _callee, undefined, [[0, 7]]);
	                            }));

	                            return function (_x4, _x5) {
	                              return _ref2.apply(this, arguments);
	                            };
	                          }());
	                        });
	                      };

	                      _context2.next = 10;
	                      return _promise2.default.all(getPathPromises());

	                    case 10:
	                      result = _context2.sent;


	                      /** example:
	                        [
	                         "https://example.com/upload/IMG_2951.PNG"
	                       ]
	                        */
	                      res.json(result);

	                    case 12:
	                    case 'end':
	                      return _context2.stop();
	                  }
	                }
	              }, _callee2, undefined);
	            })(), 't0', 2);

	          case 2:
	            _ret = _context3.t0;

	            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
	              _context3.next = 5;
	              break;
	            }

	            return _context3.abrupt('return', _ret.v);

	          case 5:
	            _context3.next = 10;
	            break;

	          case 7:
	            _context3.prev = 7;
	            _context3.t1 = _context3['catch'](0);

	            next(_context3.t1);

	          case 10:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, undefined, [[0, 7]]);
	  }));

	  return function (_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = require("formidable");

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = require("fs-promise");

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var seashellResult;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            seashellResult = res.locals.seashellResult;
	            /**
	             * 检查headers
	             */

	            if (seashellResult.headers.__HTML) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt("return", next());

	          case 4:
	            res.write(seashellResult.body.html);
	            res.end();
	            _context.next = 11;
	            break;

	          case 8:
	            _context.prev = 8;
	            _context.t0 = _context["catch"](0);

	            next(_context.t0);

	          case 11:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 8]]);
	  }));

	  return function (_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _typeof2 = __webpack_require__(31);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _path = __webpack_require__(39);

	var _path2 = _interopRequireDefault(_path);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 文件下载代理
	 */
	var handleFILE = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var _ret;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;

	            _ret = function () {
	              var _res$locals = res.locals,
	                  location = _res$locals.location,
	                  host = _res$locals.host,
	                  url = _res$locals.url;

	              if (location.type.toUpperCase() != 'FILE') return {
	                  v: next()
	                };
	              // const baseDir = location.content;
	              var baseDir = _config2.default.datadir + '/app/' + host.hostname + '/public';
	              var filePath = _path2.default.join(baseDir, url.pathname);

	              if (_config2.default.debug) console.log(filePath);
	              return {
	                v: res.sendFile(filePath, {
	                  CacheControl: true,
	                  "maxAge": 31536000000,
	                  headers: {
	                    // "Access-Control-Allow-Origin": "*",
	                    "Expires": new Date(Date.now() + 31536000000)
	                  }
	                }, function (err) {
	                  if (err && !res.headersSent) {
	                    var lastParam = url.pathname.split('/').pop();
	                    if (lastParam.length && !/\./.test(lastParam)) return res.redirect(req.path + '/');
	                    next(new Error('NOT_FOUND'));
	                  }
	                })
	              };
	            }();

	            if (!((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object")) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', _ret.v);

	          case 4:
	            _context.next = 9;
	            break;

	          case 6:
	            _context.prev = 6;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 9:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 6]]);
	  }));

	  return function handleFILE(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handleFILE;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _keys = __webpack_require__(32);

	var _keys2 = _interopRequireDefault(_keys);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _fsPromise = __webpack_require__(40);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	var _httpProxy = __webpack_require__(44);

	var _httpProxy2 = _interopRequireDefault(_httpProxy);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 反向代理
	 */
	var handlePROXY = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var location, proxy;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            location = res.locals.location;

	            if (!(location.type.toUpperCase() != 'PROXY')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:

	            if (_config2.default.debug) console.log('proxy...');

	            proxy = _httpProxy2.default.createProxyServer({
	              // protocolRewrite: 'http'
	            });

	            // todo handle ssl cert to options

	            proxy.web(req, res, {
	              target: location.content
	            });

	            proxy.on('error', function (err, req, res) {
	              next(err);
	            });

	            proxy.on('proxyRes', function (proxyRes, req, res) {
	              (0, _keys2.default)(proxyRes.headers).forEach(function (key) {
	                res.set(key, proxyRes.headers[key]);
	              });
	            });

	            proxy.close();

	            _context.next = 15;
	            break;

	          case 12:
	            _context.prev = 12;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 15:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 12]]);
	  }));

	  return function handlePROXY(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handlePROXY;

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = require("http-proxy");

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 黑名单域名
	 */
	var handleBLOCK = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var _res$locals, location, url;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            _res$locals = res.locals, location = _res$locals.location, url = _res$locals.url;

	            if (!(location.type.toUpperCase() != 'BLOCK')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:
	            res.redirect('https://www.google.com/s?q=' + req.headers.host + ' is dangerous.');
	            _context.next = 10;
	            break;

	          case 7:
	            _context.prev = 7;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 10:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 7]]);
	  }));

	  return function handleBLOCK(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handleBLOCK;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 重定向
	 */

	var handleREDIRECT = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var location;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            location = res.locals.location;

	            if (!(location.type.toUpperCase() != 'REDIRECT')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:
	            res.redirect(location.content);

	            _context.next = 10;
	            break;

	          case 7:
	            _context.prev = 7;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 10:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 7]]);
	  }));

	  return function handleREDIRECT(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handleREDIRECT;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 返回json
	 */
	var handleJSON = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var location;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            location = res.locals.location;

	            if (!(location.type.toUpperCase() != 'JSON')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:
	            return _context.abrupt('return', res.json(JSON.parse(location.content)));

	          case 7:
	            _context.prev = 7;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 10:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 7]]);
	  }));

	  return function handleJSON(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handleJSON;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _ent = __webpack_require__(34);

	var _ent2 = _interopRequireDefault(_ent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 返回html
	 */

	var handleHTML = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var location;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            location = res.locals.location;

	            if (!(location.type.toUpperCase() != 'HTML')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:
	            if (location.contentType == 'file') {
	              res.sendFile(location.content, {
	                headers: {
	                  'Expires': new Date(Date.now() + 1000 * 10) // 10s
	                }
	              }, function (err) {
	                if (err && !res.headersSent) res.sendStatus(404);
	              });
	            } else {
	              res.end(_ent2.default.decode(location.content));
	            }

	            _context.next = 10;
	            break;

	          case 7:
	            _context.prev = 7;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 10:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 7]]);
	  }));

	  return function handleHTML(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = handleHTML;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const Lambda = require('../../model/Lambda')

	/**
	 * 返回json
	 */
	var lambdaHandle = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	    var location, danger, response;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            location = res.locals.location;

	            if (!(location.type != 'LAMBDA')) {
	              _context.next = 4;
	              break;
	            }

	            return _context.abrupt('return', next());

	          case 4:

	            /**
	             * example fn
	             `
	             return new Promise(function (resolve, reject){
	                try {
	                  resolve(Date.now())
	                } catch(e){
	                  reject(e)
	                }
	              })
	             `
	              */

	            // const lam = await Lambda.findOne({path: req.path})
	            // if (!lam) return next()

	            danger = new Function('options', location.content);
	            _context.next = 7;
	            return danger({
	              query: req.query
	            });

	          case 7:
	            response = _context.sent;


	            res.json({ response: response });

	            _context.next = 14;
	            break;

	          case 11:
	            _context.prev = 11;
	            _context.t0 = _context['catch'](0);

	            next(_context.t0);

	          case 14:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 11]]);
	  }));

	  return function lambdaHandle(_x, _x2, _x3) {
	    return _ref.apply(this, arguments);
	  };
	}();

	module.exports = lambdaHandle;

/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * 下载文件
	 *
	 */
	var downloadHandle = function downloadHandle(req, res, next) {
	  var _res$locals = res.locals,
	      location = _res$locals.location,
	      url = _res$locals.url,
	      host = _res$locals.host;

	  if (location.type.toUpperCase() != 'DOWNLOAD') return next(new Error('NOT_UPLOAD'));

	  if (typeof req.query.path == 'undefined') return next(new Error('PARAMS_LOST'));
	  var rawPath = decodeURI(req.query.path);
	  var result = { path: rawPath };
	  var truePath = rawPath;
	  res.download(truePath);
	};

	module.exports = downloadHandle;

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _seashellClientNode = __webpack_require__(52);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createApp = function createApp(db) {

	  var app = new _seashellClientNode.Router();

	  var handleRequest = (0, _sprucejs.combineReducers)([__webpack_require__(53), __webpack_require__(24), __webpack_require__(30)])(db);

	  app.use(function (req, res, next) {
	    res.app = app;
	    res.json = function (data) {
	      res.body = data;
	      res.end();
	    };
	    res.error = function (error) {
	      return res.json({ error: error });
	    };
	    next();
	  });

	  // app.use(async (req, res, next) => {
	  //
	  //   const {token} = req.body;
	  //   if (config.debug) console.log(token);
	  //   if (!token) throw new Error('PERMISSION_DENIED');
	  //   const {body} = await app.request('/account/session', {token});
	  //   if (config.debug) console.log(body);
	  //   if (body.error || body.user == null) throw new Error('PERMISSION_DENIED');
	  //   res.session = body;
	  //   next()
	  // });

	  app.use(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var reducerName, result;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              reducerName = req.body.reducerName;

	              if (reducerName) {
	                _context.next = 3;
	                break;
	              }

	              return _context.abrupt('return', next(new Error('PARAM_ILLEGAL')));

	            case 3:
	              _context.next = 5;
	              return handleRequest(req.body);

	            case 5:
	              result = _context.sent;

	              res.json(result);

	            case 7:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  app.use(function (err, req, res, next) {

	    if (err.name == 'ValidationError') return res.error('PARAM_ILLEGAL');
	    if (err.message == 'Command failed') return res.error('COMMAND_FAILED');

	    return res.error(err.message);
	  });

	  app.use(function (req, res) {
	    res.error('NOT_FOUND');
	  });

	  return app;
	};

	exports.default = module.exports = createApp;

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = require("seashell-client-node");

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(33);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _fsPromise = __webpack_require__(40);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	var _sprucejs = __webpack_require__(23);

	var _mkdirp = __webpack_require__(54);

	var _mkdirp2 = _interopRequireDefault(_mkdirp);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var File = function (_Model) {
	  (0, _inherits3.default)(File, _Model);

	  function File() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, File);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = File.__proto__ || (0, _getPrototypeOf2.default)(File)).call.apply(_ref, [this].concat(args))), _this), _this.initHostDir = function (hostname) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  (0, _mkdirp2.default)(_config2.default.datadir + '/app/' + hostname + '/public', function (err) {
	                    if (err) return reject(err);
	                    resolve();
	                  });

	                case 1:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.vi = function (req) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var file, content;
	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.prev = 0;
	                  file = req.file, content = req.content;
	                  _context2.next = 4;
	                  return _fsPromise2.default.writeFile(file, content, 'utf-8');

	                case 4:
	                  resolve({});
	                  _context2.next = 10;
	                  break;

	                case 7:
	                  _context2.prev = 7;
	                  _context2.t0 = _context2['catch'](0);

	                  reject(_context2.t0);

	                case 10:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2, [[0, 7]]);
	        }));

	        return function (_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _this.mv = function (req) {
	      return new _promise2.default(function () {
	        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	          var prevFile, nextFile;
	          return _regenerator2.default.wrap(function _callee3$(_context3) {
	            while (1) {
	              switch (_context3.prev = _context3.next) {
	                case 0:
	                  _context3.prev = 0;
	                  prevFile = req.prevFile, nextFile = req.nextFile;
	                  _context3.next = 4;
	                  return _fsPromise2.default.rename(prevFile, nextFile);

	                case 4:
	                  resolve({});
	                  _context3.next = 10;
	                  break;

	                case 7:
	                  _context3.prev = 7;
	                  _context3.t0 = _context3['catch'](0);

	                  reject(_context3.t0);

	                case 10:
	                case 'end':
	                  return _context3.stop();
	              }
	            }
	          }, _callee3, _this2, [[0, 7]]);
	        }));

	        return function (_x5, _x6) {
	          return _ref4.apply(this, arguments);
	        };
	      }());
	    }, _this.ls = function (req) {
	      return new _promise2.default(function () {
	        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	          return _regenerator2.default.wrap(function _callee5$(_context5) {
	            while (1) {
	              switch (_context5.prev = _context5.next) {
	                case 0:
	                  _context5.prev = 0;
	                  return _context5.delegateYield(_regenerator2.default.mark(function _callee4() {
	                    var pathname, hostname, prefix, directory, files, stats, ls;
	                    return _regenerator2.default.wrap(function _callee4$(_context4) {
	                      while (1) {
	                        switch (_context4.prev = _context4.next) {
	                          case 0:
	                            pathname = req.pathname, hostname = req.hostname;
	                            prefix = _config2.default.datadir + '/app/' + hostname;
	                            directory = '' + prefix + pathname;
	                            _context4.next = 5;
	                            return _fsPromise2.default.readdir(directory);

	                          case 5:
	                            files = _context4.sent;
	                            _context4.next = 8;
	                            return _promise2.default.all(files.map(function (file) {
	                              return _fsPromise2.default.lstat(directory + '/' + file);
	                            }));

	                          case 8:
	                            stats = _context4.sent;
	                            ls = files.map(function (name, index) {
	                              var stat = stats[index];
	                              return {
	                                name: name,
	                                stat: stat,
	                                isFile: stat.isFile(),
	                                isDirectory: stat.isDirectory()
	                              };
	                            });

	                            resolve({ ls: ls });

	                          case 11:
	                          case 'end':
	                            return _context4.stop();
	                        }
	                      }
	                    }, _callee4, _this2);
	                  })(), 't0', 2);

	                case 2:
	                  _context5.next = 7;
	                  break;

	                case 4:
	                  _context5.prev = 4;
	                  _context5.t1 = _context5['catch'](0);

	                  reject(new Error('ENOENT'));

	                case 7:
	                case 'end':
	                  return _context5.stop();
	              }
	            }
	          }, _callee5, _this2, [[0, 4]]);
	        }));

	        return function (_x7, _x8) {
	          return _ref5.apply(this, arguments);
	        };
	      }());
	    }, _this.cat = function (req) {
	      return new _promise2.default(function () {
	        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(resolve, reject) {
	          var host, filename, prefix, cat;
	          return _regenerator2.default.wrap(function _callee6$(_context6) {
	            while (1) {
	              switch (_context6.prev = _context6.next) {
	                case 0:
	                  _context6.prev = 0;
	                  host = req.host, filename = req.filename;
	                  prefix = _config2.default.datadir + '/app/' + host;
	                  _context6.next = 5;
	                  return _fsPromise2.default.readFile(prefix + '/' + filename, 'utf-8');

	                case 5:
	                  cat = _context6.sent;

	                  resolve({ cat: cat });
	                  _context6.next = 12;
	                  break;

	                case 9:
	                  _context6.prev = 9;
	                  _context6.t0 = _context6['catch'](0);

	                  reject(_context6.t0);

	                case 12:
	                case 'end':
	                  return _context6.stop();
	              }
	            }
	          }, _callee6, _this2, [[0, 9]]);
	        }));

	        return function (_x9, _x10) {
	          return _ref6.apply(this, arguments);
	        };
	      }());
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * @api {POST} /File/vi 修改文件
	   * @apiGroup File
	   * @apiName FileVi
	   * @apiParam {string} token 令牌
	   * @apiParam {string} file
	   * @apiParam {string} content
	   */


	  /**
	   * @api {POST} /File/mv 移动、重命名文件
	   * @apiGroup File
	   * @apiName FileMv
	   * @apiParam {string} token 令牌
	   * @apiParam {string} prevFile
	   * @apiParam {string} nextFile
	   */


	  /**
	   * @api {POST} /File/ls 获取文件列表
	   * @apiGroup File
	   * @apiName FileLs
	   * @apiParam {string} token 令牌
	   * @apiParam {string} hostname
	   * @apiParam {string} pathname
	   */


	  /**
	   * @api {POST} /File/cat 获取文件内容
	   * @apiGroup File
	   * @apiName FileCat
	   * @apiParam {string} token 令牌
	   * @apiParam {string} host host
	   * @apiParam {string} filename 文件路径
	   * @apiSuccess {string} cat 内容
	   */


	  (0, _createClass3.default)(File, [{
	    key: 'resolve',
	    value: function resolve(req) {
	      var action = req.action;

	      if (action == 'cat') return this.cat(req);
	      if (action == 'ls') return this.ls(req);
	      if (action == 'mv') return this.mv(req);
	      if (action == 'vi') return this.vi(req);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('NOT_FOUND'));
	      });
	    }
	  }]);
	  return File;
	}(_sprucejs.Model);

	module.exports = File;

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = require("mkdirp");

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _seashellClientNode = __webpack_require__(52);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (db, handler) {

	  var router = new _seashellClientNode.Router();

	  /**
	   * add `res.json` method
	   */
	  router.use(function (req, res, next) {
	    res.json = function (body) {
	      res.body = body;
	      res.end();
	    };
	    res.error = function (errCode) {
	      res.json({ error: errCode });
	    };
	    next();
	  });

	  router.use(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var result;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (req.body.hasOwnProperty('reducerName')) {
	                _context.next = 2;
	                break;
	              }

	              throw new Error('ILLEGAL_PARAMS');

	            case 2:
	              _context.next = 4;
	              return handler(req.body);

	            case 4:
	              result = _context.sent;

	              res.json(result);

	            case 6:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  /**
	   * error handle
	   */
	  router.use(function (err, req, res, next) {
	    res.error(err.message);
	  });

	  /**
	   * 404 handle
	   */
	  router.use(function (req, res) {
	    res.error('ROUTER_NOT_FOUND');
	  });

	  return router;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _seashellClientNode = __webpack_require__(52);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = module.exports = function (db) {

	  var app = new _seashellClientNode.Router();
	  var handler = (0, _sprucejs.combineReducers)([__webpack_require__(57), __webpack_require__(58), __webpack_require__(60), __webpack_require__(62), __webpack_require__(63)])(db);

	  app.use(function (req, res, next) {
	    res.app = app;
	    res.json = function (data) {
	      res.body = data;
	      res.end();
	    };
	    next();
	  });

	  /**
	   * 通用中间件
	   * 检查session, 并把session传递给下面的中间件
	   */
	  app.use(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var user;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              req.body.session = {
	                user: null
	              };

	              _context.prev = 1;

	              if (req.body.hasOwnProperty('token')) {
	                _context.next = 4;
	                break;
	              }

	              return _context.abrupt('return', next());

	            case 4:
	              _context.next = 6;
	              return handler({
	                reducerName: 'token',
	                action: 'session',
	                token: req.body.token
	              });

	            case 6:
	              user = _context.sent;

	              req.body.session = { user: user };
	              next();
	              _context.next = 16;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context['catch'](1);

	              if (!(_context.t0.message == 'SESSION_EMPTY')) {
	                _context.next = 15;
	                break;
	              }

	              return _context.abrupt('return', next());

	            case 15:
	              next(_context.t0);

	            case 16:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[1, 11]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  app.use(function () {
	    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, next) {
	      var result;
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (req.body.hasOwnProperty('reducerName')) {
	                _context2.next = 2;
	                break;
	              }

	              throw new Error('PARAM_ILLEGAL');

	            case 2:
	              _context2.next = 4;
	              return handler(req.body);

	            case 4:
	              result = _context2.sent;

	              res.json(result);

	            case 6:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined);
	    }));

	    return function (_x4, _x5, _x6) {
	      return _ref2.apply(this, arguments);
	    };
	  }());

	  app.use(function (err, req, res, next) {
	    if (err.name == 'ValidationError') return res.json({ error: 'PARAM_ILLEGAL' });
	    if (err.message == 'Command failed') return res.json({ error: 'COMMAND_FAILED' });
	    return res.json({ error: err.message });
	  });

	  app.use(function (req, res, next) {
	    res.json({ error: 'NOT_FOUND' });
	  });

	  return app;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Email = function (_Model) {
	  (0, _inherits3.default)(Email, _Model);

	  function Email() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Email);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Email.__proto__ || (0, _getPrototypeOf2.default)(Email)).call.apply(_ref, [this].concat(args))), _this), _this._getUserIdWithUpset = function (email, userId) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var _this$props, db, reducers, result, user;

	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  _this$props = _this.props, db = _this$props.db, reducers = _this$props.reducers;
	                  _context.prev = 2;
	                  _context.next = 5;
	                  return db.get(email);

	                case 5:
	                  result = _context.sent;

	                  resolve(result);
	                  _context.next = 25;
	                  break;

	                case 9:
	                  _context.prev = 9;
	                  _context.t0 = _context['catch'](2);

	                  if (!(_context.t0.name != 'NotFoundError')) {
	                    _context.next = 13;
	                    break;
	                  }

	                  return _context.abrupt('return', reject(_context.t0));

	                case 13:
	                  _context.prev = 13;
	                  _context.next = 16;
	                  return reducers.User._createUser({ email: email });

	                case 16:
	                  user = _context.sent;
	                  _context.next = 19;
	                  return db.put(email, user.id);

	                case 19:
	                  resolve(user.id);
	                  _context.next = 25;
	                  break;

	                case 22:
	                  _context.prev = 22;
	                  _context.t1 = _context['catch'](13);

	                  reject(_context.t1);

	                case 25:
	                  _context.next = 30;
	                  break;

	                case 27:
	                  _context.prev = 27;
	                  _context.t2 = _context['catch'](0);

	                  reject(_context.t2);

	                case 30:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 27], [2, 9], [13, 22]]);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   *
	   */


	  return Email;
	}(_sprucejs.Model);

	module.exports = Email;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createNumberCode = undefined;

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(33);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	var _aliPush = __webpack_require__(59);

	var _aliPush2 = _interopRequireDefault(_aliPush);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var client = new _aliPush2.default({
	  AccessKeyId: _config2.default.production.aliyun.accessid,
	  AccessKeySecret: _config2.default.production.aliyun.accesskey,
	  AccountName: _config2.default.production.aliyun.dms.accountName
	});

	/**
	 * 生成数字验证码
	 * @param length 验证码长度
	 */
	var createNumberCode = exports.createNumberCode = function createNumberCode() {
	  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

	  var fill0 = function fill0(str) {
	    return str.length == length ? str : fill0(str + '0');
	  };
	  return fill0(String(Math.random()).substr(2, length));
	};

	var EmailCode = function (_Model) {
	  (0, _inherits3.default)(EmailCode, _Model);

	  function EmailCode() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, EmailCode);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EmailCode.__proto__ || (0, _getPrototypeOf2.default)(EmailCode)).call.apply(_ref, [this].concat(args))), _this), _this.createLoginCode = function (query, ctx) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var email, db, code, options;
	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  email = query.email;
	                  db = _this.props.db;

	                  console.log(email);
	                  code = createNumberCode();
	                  _context.next = 7;
	                  return db.put(email, { code: code, createTime: Date.now() });

	                case 7:
	                  options = {
	                    ToAddress: email,
	                    Subject: '验证码',
	                    FromAlias: '右括号',
	                    TextBody: '\u60A8\u7684\u9A8C\u8BC1\u7801\u4E3A' + code
	                  };


	                  client.SingleSendMail(options, function (err, res, body) {
	                    if (err) return reject(err);
	                    resolve({});
	                  });

	                  _context.next = 14;
	                  break;

	                case 11:
	                  _context.prev = 11;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 14:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 11]]);
	        }));

	        return function (_x2, _x3) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this._checkCode = function (email, code) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var _this$props, db, reducers, result;

	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.prev = 0;
	                  _this$props = _this.props, db = _this$props.db, reducers = _this$props.reducers;
	                  _context2.next = 4;
	                  return db.get(email);

	                case 4:
	                  result = _context2.sent;

	                  if (!(result.code != code)) {
	                    _context2.next = 7;
	                    break;
	                  }

	                  return _context2.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	                case 7:
	                  if (!(result.createTime + 6000 * 3 > Date.now())) {
	                    _context2.next = 9;
	                    break;
	                  }

	                  return _context2.abrupt('return', reject(new Error('EXPIRE_CODE')));

	                case 9:
	                  _context2.next = 11;
	                  return db.del(email);

	                case 11:
	                  resolve(true);
	                  _context2.next = 19;
	                  break;

	                case 14:
	                  _context2.prev = 14;
	                  _context2.t0 = _context2['catch'](0);

	                  if (!(_context2.t0.name == 'NotFoundError')) {
	                    _context2.next = 18;
	                    break;
	                  }

	                  return _context2.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	                case 18:
	                  reject(_context2.t0);

	                case 19:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2, [[0, 14]]);
	        }));

	        return function (_x4, _x5) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * @api {POST} /account/emailcode/createlogincode 获取登录验证码
	   * @apiGroup Account
	   * @apiName EmailCodeForLogin
	   * @apiParam {string} email 邮箱
	   */


	  /**
	   * 检查code
	   */


	  (0, _createClass3.default)(EmailCode, [{
	    key: 'resolve',
	    value: function resolve(query) {
	      if (query.action == 'createLoginCode') return this.createLoginCode(query);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('ACTION_NOT_FOUND'));
	      });
	    }
	  }]);
	  return EmailCode;
	}(_sprucejs.Model);

	module.exports = EmailCode;

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("ali-push");

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	var _crypto = __webpack_require__(61);

	var _crypto2 = _interopRequireDefault(_crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var normalCode = function normalCode() {
	  return _crypto2.default.randomBytes(32).toString('hex');
	};

	var SSOCode = function (_Model) {
	  (0, _inherits3.default)(SSOCode, _Model);

	  function SSOCode() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, SSOCode);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = SSOCode.__proto__ || (0, _getPrototypeOf2.default)(SSOCode)).call.apply(_ref, [this].concat(args))), _this), _this._createCode = function (token) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var db, code;
	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  db = _this.props.db;
	                  code = normalCode();
	                  _context.next = 5;
	                  return db.put(code, { token: token, code: code });

	                case 5:
	                  resolve(code);
	                  _context.next = 11;
	                  break;

	                case 8:
	                  _context.prev = 8;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 11:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 8]]);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.Get = function (query, ctx) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var token, code;
	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  token = query.token;

	                  if (!ctx.res.session.user) reject(new Error('ERR_NOT_LOGGED'));
	                  _context2.next = 4;
	                  return _this._createCode(token);

	                case 4:
	                  code = _context2.sent;

	                  resolve({ code: code });

	                case 6:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2);
	        }));

	        return function (_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _this.resolve = function (query) {
	      var action = query.action;

	      if (action == 'Get') return _this.Get(query);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('ACTION_NOT_FOUND'));
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   *
	   * @param token
	   * @returns {Promise}
	   */


	  /**
	   * @api {POST} /account/ssocode/get 获取ssocode
	   * @apiName SSOCodeGet
	   * @apiGroup Account
	   * @apiParam {string} token
	   * @apiSuccess {string} code
	   */


	  return SSOCode;
	}(_sprucejs.Model);

	module.exports = SSOCode;

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createExpire = undefined;

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _sprucejs = __webpack_require__(23);

	var _crypto = __webpack_require__(61);

	var _crypto2 = _interopRequireDefault(_crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 生成超时时间 * 分钟
	 * @param minute
	 * @returns {number}
	 */
	var createExpire = exports.createExpire = function createExpire() {
	  var minute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
	  return Date.now() + 60000 * minute;
	};

	var normalToken = function normalToken() {
	  return _crypto2.default.randomBytes(48).toString('hex');
	};

	var Token = function (_Model) {
	  (0, _inherits3.default)(Token, _Model);

	  function Token() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, Token);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Token.__proto__ || (0, _getPrototypeOf2.default)(Token)).call.apply(_ref, [this].concat(args))), _this), _this._createToken = function (userId) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var _this$props, db, reducers, newToken, value;

	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  _this$props = _this.props, db = _this$props.db, reducers = _this$props.reducers;
	                  newToken = normalToken();
	                  value = { token: newToken, userId: userId };
	                  _context.next = 6;
	                  return db.put(newToken, value);

	                case 6:
	                  resolve(value);
	                  _context.next = 12;
	                  break;

	                case 9:
	                  _context.prev = 9;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 12:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 9]]);
	        }));

	        return function (_x2, _x3) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.session = function (query) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var _this$props2, db, reducers, token;

	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  _context2.prev = 0;
	                  _this$props2 = _this.props, db = _this$props2.db, reducers = _this$props2.reducers;
	                  _context2.next = 4;
	                  return db.get(query.token);

	                case 4:
	                  token = _context2.sent;
	                  _context2.t0 = resolve;
	                  _context2.next = 8;
	                  return reducers.User.Get(token.userId);

	                case 8:
	                  _context2.t1 = _context2.sent;
	                  (0, _context2.t0)(_context2.t1);
	                  _context2.next = 17;
	                  break;

	                case 12:
	                  _context2.prev = 12;
	                  _context2.t2 = _context2['catch'](0);

	                  if (!(_context2.t2.name == 'NotFoundError')) {
	                    _context2.next = 16;
	                    break;
	                  }

	                  return _context2.abrupt('return', reject(new Error('EMPTY_SESSION')));

	                case 16:
	                  reject(_context2.t2);

	                case 17:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2, [[0, 12]]);
	        }));

	        return function (_x4, _x5) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _this.getTokenByEmailCode = function (query) {
	      return new _promise2.default(function () {
	        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	          var code, email, _this$props3, db, reducers, userId, token;

	          return _regenerator2.default.wrap(function _callee3$(_context3) {
	            while (1) {
	              switch (_context3.prev = _context3.next) {
	                case 0:
	                  _context3.prev = 0;
	                  code = query.code, email = query.email;
	                  _this$props3 = _this.props, db = _this$props3.db, reducers = _this$props3.reducers;
	                  _context3.next = 5;
	                  return reducers.EmailCode._checkCode(email, code);

	                case 5:
	                  _context3.next = 7;
	                  return reducers.Email._getUserIdWithUpset(email);

	                case 7:
	                  userId = _context3.sent;
	                  _context3.next = 10;
	                  return _this._createToken(userId);

	                case 10:
	                  token = _context3.sent;

	                  resolve(token);

	                  _context3.next = 17;
	                  break;

	                case 14:
	                  _context3.prev = 14;
	                  _context3.t0 = _context3['catch'](0);

	                  reject(_context3.t0);

	                case 17:
	                case 'end':
	                  return _context3.stop();
	              }
	            }
	          }, _callee3, _this2, [[0, 14]]);
	        }));

	        return function (_x6, _x7) {
	          return _ref4.apply(this, arguments);
	        };
	      }());
	    }, _this.getTokenBySSOCode = function (query) {
	      return new _promise2.default(function () {
	        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	          var _this$props4, db, reducers, result;

	          return _regenerator2.default.wrap(function _callee4$(_context4) {
	            while (1) {
	              switch (_context4.prev = _context4.next) {
	                case 0:
	                  _context4.prev = 0;
	                  _this$props4 = _this.props, db = _this$props4.db, reducers = _this$props4.reducers;
	                  _context4.next = 4;
	                  return reducers.SSOCode.get(query.code);

	                case 4:
	                  result = _context4.sent;

	                  resolve({ token: result.token });
	                  _context4.next = 11;
	                  break;

	                case 8:
	                  _context4.prev = 8;
	                  _context4.t0 = _context4['catch'](0);

	                  reject(_context4.t0);

	                case 11:
	                case 'end':
	                  return _context4.stop();
	              }
	            }
	          }, _callee4, _this2, [[0, 8]]);
	        }));

	        return function (_x8, _x9) {
	          return _ref5.apply(this, arguments);
	        };
	      }());
	    }, _this.logout = function (query, ctx) {
	      return new _promise2.default(function () {
	        var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	          var _this$props5, db, reducers;

	          return _regenerator2.default.wrap(function _callee5$(_context5) {
	            while (1) {
	              switch (_context5.prev = _context5.next) {
	                case 0:
	                  _context5.prev = 0;
	                  _this$props5 = _this.props, db = _this$props5.db, reducers = _this$props5.reducers;

	                  if (!ctx.res.session.user) {
	                    _context5.next = 5;
	                    break;
	                  }

	                  _context5.next = 5;
	                  return db.del(query.token);

	                case 5:
	                  resolve({});
	                  _context5.next = 11;
	                  break;

	                case 8:
	                  _context5.prev = 8;
	                  _context5.t0 = _context5['catch'](0);

	                  reject(_context5.t0);

	                case 11:
	                case 'end':
	                  return _context5.stop();
	              }
	            }
	          }, _callee5, _this2, [[0, 8]]);
	        }));

	        return function (_x10, _x11) {
	          return _ref6.apply(this, arguments);
	        };
	      }());
	    }, _this.resolve = function (query) {
	      var action = query.action;

	      if (action == 'session') return _this.session(query);
	      if (action == 'getTokenByEmailCode') return _this.getTokenByEmailCode(query);
	      if (action == 'getTokenBySSOCode') return _this.getTokenBySSOCode(query);
	      if (action == 'logout') return _this.logout(query);
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('ACTION_NOT_FOUND'));
	      });
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * 创建token
	   */


	  /**
	   * @api {POST} /account/session 获取session信息
	   * @apiName Session
	   * @apiGroup Account
	   * @apiDescription 获取session信息
	   * @apiParam {string} token 令牌
	   * @apiSuccess {object} user
	   */


	  /**
	   * @api {POST} /account/token/gettokenbyemailcode 根据email验证码获取token
	   * @apiName TokenByEmailCode
	   * @apiGroup Account
	   * @apiParam {string} code
	   * @apiParam {string} email
	   * @apiSuccess {string} token
	   */


	  /**
	   * @api {POST} /account/token/gettokenbyssocode 根据ssocode获取token
	   * @apiName TokenBySSOCode
	   * @apiGroup Account
	   * @apiParam {string} code code
	   * @apiSuccess {string} token token
	   */


	  /**
	   * @api {POST} /account/token/logout 注销token
	   * @apiName Logout
	   * @apiGroup Account
	   * @apiParam {string} token token
	   */


	  return Token;
	}(_sprucejs.Model);

	module.exports = Token;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(3);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(25);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(26);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(33);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(27);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(28);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _uuid = __webpack_require__(64);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var User = function (_Model) {
	  (0, _inherits3.default)(User, _Model);

	  function User() {
	    var _ref,
	        _this2 = this;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, User);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = User.__proto__ || (0, _getPrototypeOf2.default)(User)).call.apply(_ref, [this].concat(args))), _this), _this._createUser = function (options) {
	      return new _promise2.default(function () {
	        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	          var db, id;
	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  db = _this.props.db;
	                  id = _uuid2.default.v4();
	                  _context.next = 5;
	                  return db.put(id, (0, _assign2.default)({}, options, { id: id }));

	                case 5:
	                  resolve({ id: id });
	                  _context.next = 11;
	                  break;

	                case 8:
	                  _context.prev = 8;
	                  _context.t0 = _context['catch'](0);

	                  reject(_context.t0);

	                case 11:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this2, [[0, 8]]);
	        }));

	        return function (_x, _x2) {
	          return _ref2.apply(this, arguments);
	        };
	      }());
	    }, _this.Get = function (userId) {
	      var db = _this.props.db;

	      return db.get(userId);
	    }, _this.userList = function (query, ctx) {
	      return new _promise2.default(function () {
	        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	          var db, result;
	          return _regenerator2.default.wrap(function _callee2$(_context2) {
	            while (1) {
	              switch (_context2.prev = _context2.next) {
	                case 0:
	                  try {
	                    db = _this.props.db;
	                    result = db.find({});

	                    resolve(result);
	                  } catch (e) {
	                    reject(e);
	                  }

	                case 1:
	                case 'end':
	                  return _context2.stop();
	              }
	            }
	          }, _callee2, _this2);
	        }));

	        return function (_x3, _x4) {
	          return _ref3.apply(this, arguments);
	        };
	      }());
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * @api {POST} /account/user/userlist 获取用户列表
	   * @apiName UserList
	   * @apiGroup Account
	   * @apiParam {string} model model名, user
	   */


	  (0, _createClass3.default)(User, [{
	    key: 'resolve',
	    value: function resolve() {
	      return new _promise2.default(function (resolve, reject) {
	        return reject(new Error('ACTION_NOT_FOUND'));
	      });
	    }
	  }]);
	  return User;
	}(_sprucejs.Model);

	module.exports = User;

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.promisifydb = exports.subdb = exports.opendb = undefined;

	var _levelup = __webpack_require__(66);

	var _levelup2 = _interopRequireDefault(_levelup);

	var _qLevel = __webpack_require__(67);

	var _qLevel2 = _interopRequireDefault(_qLevel);

	var _levelSublevel = __webpack_require__(68);

	var _levelSublevel2 = _interopRequireDefault(_levelSublevel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var opendb = function opendb(dbdir) {
	  return (0, _levelup2.default)(dbdir, { valueEncoding: 'json' });
	};

	var promisifydb = function promisifydb(db) {
	  return (0, _qLevel2.default)(db);
	};

	var subdb = function subdb(db, subname) {
	  return (0, _levelSublevel2.default)(db).sublevel(subname);
	};

	exports.opendb = opendb;
	exports.subdb = subdb;
	exports.promisifydb = promisifydb;

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = require("levelup");

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = require("q-level");

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = require("level-sublevel");

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(2);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(4);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(21);

	var _promise2 = _interopRequireDefault(_promise);

	var _sprucejs = __webpack_require__(23);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (db, initdata) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var domain, handler;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              domain = initdata.domain;
	              handler = (0, _sprucejs.combineReducers)([__webpack_require__(24), __webpack_require__(30)])(db);

	              // try {
	              //   await handler({
	              //     reducerName: 'host',
	              //     action: 'Delete',
	              //     hostname: domain
	              //   });
	              // } catch(e){
	              //   console.log(e.stack)
	              // }


	              _context.next = 5;
	              return handler({
	                reducerName: 'host',
	                action: 'New',
	                hostname: domain
	              });

	            case 5:
	              _context.next = 7;
	              return handler({
	                reducerName: 'location',
	                action: 'New',
	                hostname: domain,
	                pathname: '/^\/api\/account.*$/',
	                cors: true,
	                sort: 1,
	                type: 'SEASHELL',
	                contentType: 'TEXT',
	                content: 'account'
	              });

	            case 7:
	              _context.next = 9;
	              return handler({
	                reducerName: 'location',
	                action: 'New',
	                hostname: domain,
	                pathname: '/^\/api\/gateway.*$/',
	                cors: true,
	                sort: 1,
	                type: 'SEASHELL',
	                contentType: 'TEXT',
	                content: 'gateway'
	              });

	            case 9:
	              _context.next = 11;
	              return handler({
	                reducerName: 'location',
	                action: 'New',
	                hostname: domain,
	                pathname: '/^\/api\/service.*$/',
	                cors: true,
	                sort: 1,
	                type: 'SEASHELL',
	                contentType: 'TEXT',
	                content: 'service'
	              });

	            case 11:

	              resolve();
	              _context.next = 17;
	              break;

	            case 14:
	              _context.prev = 14;
	              _context.t0 = _context['catch'](0);

	              reject(_context.t0);

	            case 17:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 14]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

/***/ }
/******/ ]);