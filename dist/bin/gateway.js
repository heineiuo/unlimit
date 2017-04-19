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

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _seashell = __webpack_require__(6);

	var _seashell2 = _interopRequireDefault(_seashell);

	var _chalk = __webpack_require__(7);

	var _chalk2 = _interopRequireDefault(_chalk);

	var _actionCreator = __webpack_require__(8);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _http = __webpack_require__(18);

	var _http2 = _interopRequireDefault(_http);

	var _allActionCreators = __webpack_require__(44);

	var _allActionCreators2 = _interopRequireDefault(_allActionCreators);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var start = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
	    var app, config, leveldb, server;
	    return _regenerator2.default.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.prev = 0;
	            app = new _seashell2.default();
	            _context4.next = 4;
	            return (0, _config2.default)();

	          case 4:
	            config = _context4.sent;
	            _context4.next = 7;
	            return (0, _leveldb2.default)();

	          case 7:
	            leveldb = _context4.sent;


	            app.use(function () {
	              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
	                return _regenerator2.default.wrap(function _callee$(_context) {
	                  while (1) {
	                    switch (_context.prev = _context.next) {
	                      case 0:
	                        ctx.leveldb = leveldb;
	                        ctx.config = config;
	                        ctx.json = function (json) {
	                          ctx.response.body = json;
	                          ctx.response.end();
	                        };
	                        ctx.setHeader = function (header) {
	                          (0, _assign2.default)(ctx.response.headers, header);
	                        };
	                        ctx.error = function (error) {
	                          return ctx.json({ error: error });
	                        };
	                        ctx.on('error', function (err) {
	                          if (config.debug) console.error(_chalk2.default.red('[SEASHELL][INTEGRATE SERVICE] ' + err.message + err.stack));
	                          if (err.name === 'ValidationError') return ctx.error('PARAM_ILLEGAL');
	                          if (err.message === 'Command failed') return ctx.error('COMMAND_FAILED');
	                          return ctx.error(err.message);
	                        });
	                        ctx.on('end', function () {
	                          if (!ctx.state.isHandled) {
	                            ctx.response.body = { error: 'CAN_NOT_HANDLE_TIS_REQUEST' };
	                            ctx.response.end();
	                          }
	                        });
	                        next();

	                      case 8:
	                      case 'end':
	                        return _context.stop();
	                    }
	                  }
	                }, _callee, undefined);
	              }));

	              return function (_x, _x2) {
	                return _ref2.apply(this, arguments);
	              };
	            }());

	            app.use('/account/session', function () {
	              var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx) {
	                return _regenerator2.default.wrap(function _callee2$(_context2) {
	                  while (1) {
	                    switch (_context2.prev = _context2.next) {
	                      case 0:
	                        if (ctx.request.headers.session) {
	                          ctx.json(ctx.request.headers.session);
	                        } else {
	                          ctx.error('NOT_LOGGED');
	                        }

	                      case 1:
	                      case 'end':
	                        return _context2.stop();
	                    }
	                  }
	                }, _callee2, undefined);
	              }));

	              return function (_x3) {
	                return _ref3.apply(this, arguments);
	              };
	            }());

	            app.use('/:moduleName/:actionName', function () {
	              var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(ctx) {
	                var _ctx$request$params, moduleName, actionName, actionCreators, dispatch, actionType, result;

	                return _regenerator2.default.wrap(function _callee3$(_context3) {
	                  while (1) {
	                    switch (_context3.prev = _context3.next) {
	                      case 0:
	                        _ctx$request$params = ctx.request.params, moduleName = _ctx$request$params.moduleName, actionName = _ctx$request$params.actionName;

	                        if (_allActionCreators2.default.hasOwnProperty(moduleName)) {
	                          _context3.next = 3;
	                          break;
	                        }

	                        return _context3.abrupt('return', ctx.error('NOT_FOUND'));

	                      case 3:
	                        actionCreators = _allActionCreators2.default[moduleName];

	                        if (actionCreators.hasOwnProperty(actionName)) {
	                          _context3.next = 6;
	                          break;
	                        }

	                        return _context3.abrupt('return', ctx.error('NOT_FOUND'));

	                      case 6:
	                        dispatch = (0, _actionCreator.createDispatch)(ctx);
	                        actionType = dispatch(actionCreators[actionName](ctx.request.body));

	                        if (!(actionType instanceof _promise2.default)) {
	                          _context3.next = 13;
	                          break;
	                        }

	                        _context3.next = 11;
	                        return actionType;

	                      case 11:
	                        result = _context3.sent;

	                        ctx.json(result);

	                      case 13:
	                      case 'end':
	                        return _context3.stop();
	                    }
	                  }
	                }, _callee3, undefined);
	              }));

	              return function (_x4) {
	                return _ref4.apply(this, arguments);
	              };
	            }());

	            // start with https server or only start WebSocket server
	            // also can be used standalone like `hub.io.listen(3443)`
	            server = (0, _http2.default)(config.production.https, app);

	            app.io.attach(server);

	            _context4.next = 19;
	            break;

	          case 15:
	            _context4.prev = 15;
	            _context4.t0 = _context4['catch'](0);

	            console.log('START FAIL\n' + _context4.t0.stack || _context4.t0);
	            process.cwd(1);

	          case 19:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, undefined, [[0, 15]]);
	  }));

	  return function start() {
	    return _ref.apply(this, arguments);
	  };
	}();

	process.nextTick(start);

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/promise");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/regenerator");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/assign");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("seashell");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("action-creator");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _os = __webpack_require__(10);

	var _yargs = __webpack_require__(11);

	var _fsPromise = __webpack_require__(12);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	var _json = __webpack_require__(13);

	var _json2 = _interopRequireDefault(_json);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {};
	var configReady = false;
	var configError = null;

	exports.default = function () {
	  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (!configError) {
	                _context.next = 2;
	                break;
	              }

	              return _context.abrupt("return", reject(configError));

	            case 2:
	              if (!configReady) {
	                _context.next = 4;
	                break;
	              }

	              return _context.abrupt("return", resolve(config));

	            case 4:
	              config = (0, _assign2.default)({ debug: true, datadir: (0, _os.homedir)() + "/data/gateway" }, _yargs.argv);
	              _context.prev = 5;
	              _context.t0 = _json2.default;
	              _context.next = 9;
	              return _fsPromise2.default.readFile(config.datadir + "/production.json", 'utf8');

	            case 9:
	              _context.t1 = _context.sent;
	              config.production = _context.t0.parse.call(_context.t0, _context.t1);

	              console.log(config);
	              configReady = true;
	              resolve(config);
	              _context.next = 20;
	              break;

	            case 16:
	              _context.prev = 16;
	              _context.t2 = _context["catch"](5);

	              configError = _context.t2;
	              reject(configError);

	            case 20:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[5, 16]]);
	    }));

	    return function (_x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("yargs");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("fs-promise");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("json5");

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _levelup = __webpack_require__(15);

	var _levelup2 = _interopRequireDefault(_levelup);

	var _levelSublevel = __webpack_require__(16);

	var _levelSublevel2 = _interopRequireDefault(_levelSublevel);

	var _qLevel = __webpack_require__(17);

	var _qLevel2 = _interopRequireDefault(_qLevel);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var leveldb = null;
	var isSetup = false;

	var makeSubLevels = function makeSubLevels(db, list) {
	  var collections = {
	    sub: function sub(subname) {
	      var lowerName = subname.toLowerCase();
	      if (collections.hasOwnProperty(lowerName)) return collections[lowerName];
	      return (0, _qLevel2.default)(db.sublevel(lowerName));
	    }
	  };
	  list.forEach(function (name) {
	    var lowerName = name.toLowerCase();
	    if (['collection', 'sub'].indexOf(lowerName) > -1) {
	      throw new Error('sublevel name could not be {sub, collection}');
	    }
	    collections[name] = collections[lowerName] = collections.sub(name);
	  });

	  collections.collection = collections.sub;

	  return collections;
	};

	var setup = function setup() {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var _ref2, datadir, db;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return (0, _config2.default)();

	            case 3:
	              _ref2 = _context.sent;
	              datadir = _ref2.datadir;
	              db = (0, _levelSublevel2.default)((0, _levelup2.default)(datadir + '/db'), {
	                keyEncoding: 'utf8',
	                valueEncoding: 'json'
	              });

	              leveldb = makeSubLevels(db, []);
	              isSetup = true;
	              resolve(leveldb);
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
	      }, _callee, undefined, [[0, 11]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	var getLeveldb = function getLeveldb() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { customError: 'LEVEL_DB_CANNOT_ACCESS' };
	  return new _promise2.default(function () {
	    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (!isSetup) {
	                _context2.next = 2;
	                break;
	              }

	              return _context2.abrupt('return', resolve(leveldb));

	            case 2:
	              _context2.prev = 2;
	              _context2.t0 = resolve;
	              _context2.next = 6;
	              return setup();

	            case 6:
	              _context2.t1 = _context2.sent;
	              (0, _context2.t0)(_context2.t1);
	              _context2.next = 14;
	              break;

	            case 10:
	              _context2.prev = 10;
	              _context2.t2 = _context2['catch'](2);

	              console.error(_context2.t2);
	              reject(options.customError);

	            case 14:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined, [[2, 10]]);
	    }));

	    return function (_x4, _x5) {
	      return _ref3.apply(this, arguments);
	    };
	  }());
	};

	exports.default = getLeveldb;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("levelup");

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("level-sublevel");

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("q-level");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _autoSni = __webpack_require__(19);

	var _autoSni2 = _interopRequireDefault(_autoSni);

	var _morgan = __webpack_require__(20);

	var _morgan2 = _interopRequireDefault(_morgan);

	var _compression = __webpack_require__(21);

	var _compression2 = _interopRequireDefault(_compression);

	var _express = __webpack_require__(22);

	var _express2 = _interopRequireDefault(_express);

	var _redirectToHttps = __webpack_require__(23);

	var _pickLocation = __webpack_require__(25);

	var _httpProxy = __webpack_require__(28);

	var _seashellProxy = __webpack_require__(31);

	var _handler = __webpack_require__(34);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @param config
	 *   "agreeTos": true,
	 *    "debug": false,
	 *    "email": "heineiuo@gmail.com",
	 *    "approvedDomains": [
	 *    ],
	 *    "domains": [
	 *       []
	 *    ]
	 * @param seashell
	 *  {
	 *    handler: () => promise,
	 *    request: () => promise
	 *  }
	 * @returns {*}
	 */
	var createServer = function createServer(config, seashell) {
	  var email = config.email,
	      debug = config.debug,
	      domains = config.domains,
	      approvedDomains = config.approvedDomains;


	  var app = (0, _express2.default)();

	  app.use((0, _morgan2.default)('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
	  app.use((0, _compression2.default)());
	  app.use(function (req, res, next) {
	    res.removeHeader("x-powered-by");
	    next();
	  });

	  app.use((0, _redirectToHttps.redirectToHttpsMiddleware)(approvedDomains));
	  app.use((0, _pickLocation.pickLocationMiddleware)(seashell));

	  /**
	   * 先判断是否需要经过seashell请求，如果是，则等待seashell请求，请求结果如果是继续操作，则修改res.locals.location等
	   * 对象，并交给handler处理，如果请求结果是直接返回结果，则直接返回，不经过handler。
	   * handler处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
	   */
	  app.use((0, _seashellProxy.seashellProxyMiddleware)(seashell));
	  app.use((0, _handler.handler)(seashell));
	  app.use((0, _httpProxy.httpProxyMiddleware)(app));

	  /**
	   * 处理handler内遇到的异常和错误
	   * `HOST_NOT_FOUND` 即没有找到host，返回404
	   * `LOCATION_NOT_FOUND` 即没有找到location，404
	   * `UNDEFINED_TYPE` 用户非法请求
	   *
	   * 其他的错误显示异常
	   */
	  app.use(function (err, req, res, next) {
	    if (!err) return next();
	    console.log('Catch Error: \n' + err.stack || err);
	    if (err.message === 'HOST_NOT_FOUND') return next();
	    if (err.message === 'LOCATION_NOT_FOUND') return res.end(req.headers.host + ': \n LOCATION NOT FOUND');
	    if (err.message === 'UNDEFINED_TYPE') return res.end(req.headers.host + ': \n CONFIGURE ERROR');
	    if (err.message === 'NOT_FOUND') return next();
	    return res.json({ error: err.message });
	  });

	  app.use(function (req, res) {
	    res.status(404);
	    res.end('NOT FOUND \n SEASHELL SERVER.');
	  });

	  var server = (0, _autoSni2.default)({
	    email: email,
	    debug: debug,
	    // domains: (hostname, callback) => callback(null, [hostname]),
	    domains: domains,
	    agreeTos: true,
	    forceSSL: false,
	    redirectCode: 301,
	    ports: {
	      http: 80,
	      https: 443
	    }
	  }, app).once("listening", function () {
	    return console.log("[SEASHELL] Listening on port 443 and 80.");
	  });

	  return server;
	}; /**
	    * This is an example integration, you should not use it directly in production.
	    *
	    * This integration shows how to proxy a http request to seashell,
	    * this means you can write http api by seashell technology, then the only thing you
	    * need do is the proxy.
	    * This integration also show how to control an http service(like stop or restart), from seashell
	    */

	exports.default = createServer;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("auto-sni");

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.redirectToHttpsMiddleware = undefined;

	var _uaParserJs = __webpack_require__(24);

	var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var redirectToHttpsMiddleware = function redirectToHttpsMiddleware(approvedDomains) {
	  return function (req, res, next) {
	    try {
	      if (approvedDomains.indexOf(req.headers.host) === -1) return next();
	      if (req.protocol === 'https') return next();
	      var browser = new _uaParserJs2.default().setUA(req.headers['user-agent']).getBrowser();
	      if (browser.name === 'IE' && Number(browser.major) < 9) return next();
	      res.redirect('https://' + req.headers.host + req.originalUrl);
	    } catch (e) {
	      next(e);
	    }
	  };
	};

	exports.redirectToHttpsMiddleware = redirectToHttpsMiddleware;

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = require("ua-parser-js");

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pickLocation = exports.pickLocationMiddleware = exports.findTargetLocation = undefined;

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _url = __webpack_require__(26);

	var _url2 = _interopRequireDefault(_url);

	var _pathToRegexp = __webpack_require__(27);

	var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**e
	 * 查找host及其location列表
	 */
	var pickLocationMiddleware = function pickLocationMiddleware(seashell) {
	  return function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var host, requestLocations, _requestLocations$bod, locations, driveId, _ref2, location, url;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              host = req.headers.host;
	              _context.next = 4;
	              return seashell.requestSelf({
	                headers: { originUrl: '/drive/queryOneByDomain' },
	                body: { domain: host, fields: ['locations'] }
	              });

	            case 4:
	              requestLocations = _context.sent;

	              if (!requestLocations.body.error) {
	                _context.next = 7;
	                break;
	              }

	              return _context.abrupt("return", next(new Error(requestLocations.body.error)));

	            case 7:
	              _requestLocations$bod = requestLocations.body, locations = _requestLocations$bod.locations, driveId = _requestLocations$bod.driveId;
	              _context.next = 10;
	              return pickLocation(locations, req.url);

	            case 10:
	              _ref2 = _context.sent;
	              location = _ref2.location;
	              url = _ref2.url;


	              res.locals.host = host;
	              res.locals.driveId = driveId.toString();
	              res.locals.url = url;
	              res.locals.location = (0, _assign2.default)({
	                'X-Frame-Options': 'SAMEORIGIN'
	              }, location, { content: location.content });

	              if (location.cors) {
	                res.set('Access-Control-Expose-Headers', '*');
	                res.set('Access-Control-Allow-Origin', '*');
	                res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With');
	                res.set('Access-Control-Allow-Methods', '*');
	              }

	              res.set('X-Frame-Options', location['X-Frame-Options']);

	              next();
	              _context.next = 26;
	              break;

	            case 22:
	              _context.prev = 22;
	              _context.t0 = _context["catch"](0);

	              console.log(_context.t0);
	              next(_context.t0);

	            case 26:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 22]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }();
	};

	/**
	 * 通过比对pathname, 找到路由
	 */
	var pickLocation = function pickLocation(locations, requrl) {
	  return new _promise2.default(function (resolve, reject) {
	    try {
	      var url = _url2.default.parse(requrl);
	      var targetLocation = findTargetLocation(locations, url);
	      var location = targetLocation ? targetLocation : {
	        pathname: '*',
	        type: 'FILE'
	      };

	      try {
	        location.content = JSON.parse(location.content);
	      } catch (e) {}

	      resolve({ url: url, location: location });
	    } catch (e) {
	      reject(new Error('LOCATION_NOT_FOUND'));
	    }
	  });
	};

	var findTargetLocation = function findTargetLocation(locations, url) {
	  return locations.find(function (item) {
	    var re = (0, _pathToRegexp2.default)(item.pathname);
	    var matches = url.pathname.match(re);
	    return matches && matches[0] === url.pathname;
	  });
	};

	exports.findTargetLocation = findTargetLocation;
	exports.pickLocationMiddleware = pickLocationMiddleware;
	exports.pickLocation = pickLocation;

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("path-to-regexp");

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.httpProxyMiddleware = undefined;

	var _keys = __webpack_require__(29);

	var _keys2 = _interopRequireDefault(_keys);

	var _httpProxy = __webpack_require__(30);

	var _httpProxy2 = _interopRequireDefault(_httpProxy);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 反向代理
	 */
	var httpProxyMiddleware = function httpProxyMiddleware(app) {

	  var proxy = _httpProxy2.default.createProxyServer({
	    // protocolRewrite: 'http'
	  });

	  proxy.on('error', function (err, req, res) {
	    res.next(err);
	  });

	  proxy.on('proxyRes', function (proxyRes, req, res) {
	    (0, _keys2.default)(proxyRes.headers).forEach(function (key) {
	      res.set(key, proxyRes.headers[key]);
	    });
	  });

	  // app.on('upgrade', (req, socket, head) => {
	  //   console.log('========upgrade==========');
	  //   proxy.ws(req, socket, head);
	  // });

	  return function (req, res, next) {

	    try {
	      var location = res.locals.location;


	      if (location.type !== 'PROXY') return next();

	      // todo handle ssl cert to options
	      proxy.web(req, res, {
	        target: location.content
	      });
	    } catch (e) {
	      next(e);
	    }
	  };
	};

	exports.httpProxyMiddleware = httpProxyMiddleware;

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = require("http-proxy");

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.seashellProxyMiddleware = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _express = __webpack_require__(22);

	var _bodyParser = __webpack_require__(32);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _pick = __webpack_require__(33);

	var _pick2 = _interopRequireDefault(_pick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var JSONSafeParse = function JSONSafeParse(content, schema) {
	  try {
	    return JSON.parse(content);
	  } catch (e) {
	    return (0, _assign2.default)({}, schema, {
	      JSONSafeParseError: e
	    });
	  }
	};

	var seashellProxyMiddleware = function seashellProxyMiddleware(seashell) {

	  var router = (0, _express.Router)();

	  router.use(function (req, res, next) {
	    var location = res.locals.location;

	    if (location.type === 'SEASHELL') return next();
	    return next(new Error('NOT_SEASHELL'));
	  });

	  router.use(_bodyParser2.default.urlencoded({ extended: true }));
	  router.use(_bodyParser2.default.json());
	  router.use(_bodyParser2.default.json({ type: 'application/*+json' }));
	  router.use(_bodyParser2.default.json({ type: 'text/html' }));
	  router.use(_bodyParser2.default.json({ type: 'text/plain' }));

	  router.use(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var _res$locals, host, url, location, __GATEWAY_META, data, content, requestUrl, result, originUrl, session;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _res$locals = res.locals, host = _res$locals.host, url = _res$locals.url, location = _res$locals.location;
	              __GATEWAY_META = (0, _assign2.default)({}, (0, _pick2.default)(req, ['ip', 'method', 'originalUrl', 'protocol']), (0, _pick2.default)(req.headers, ['user-agent', 'host']));
	              data = (0, _assign2.default)({}, req.query, req.body);
	              content = location.content;
	              requestUrl = url.pathname.substring(content.length);
	              result = null;

	              if (!(requestUrl.search(seashell.__SEASHELL_NAME) === 0)) {
	                _context.next = 24;
	                break;
	              }

	              originUrl = requestUrl.substring(seashell.__SEASHELL_NAME.length);
	              session = null;
	              _context.prev = 10;
	              _context.next = 13;
	              return seashell.requestSession({
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  'switch-identity': {
	                    appName: 'user',
	                    appSecret: data.token
	                  }
	                }
	              });

	            case 13:
	              session = _context.sent;
	              _context.next = 18;
	              break;

	            case 16:
	              _context.prev = 16;
	              _context.t0 = _context["catch"](10);

	            case 18:

	              delete data.token;

	              _context.next = 21;
	              return seashell.requestSelf({
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  originUrl: originUrl,
	                  session: session
	                },
	                body: data
	              });

	            case 21:
	              result = _context.sent;
	              _context.next = 27;
	              break;

	            case 24:
	              _context.next = 26;
	              return seashell.requestChild(requestUrl, data, {
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  'switch-identity': {
	                    appName: 'user',
	                    appSecret: data.token
	                  }
	                }
	              });

	            case 26:
	              result = _context.sent;

	            case 27:

	              if (result.headers.hasOwnProperty('__HTML')) {
	                (0, _assign2.default)(res.locals.location, { type: 'HTML', content: result.body.html });
	              } else if (result.headers.hasOwnProperty('__UPLOAD')) {
	                (0, _assign2.default)(res.locals.location, { type: 'UPLOAD', content: result.body });
	              } else {
	                (0, _assign2.default)(res.locals.location, { type: 'JSON', content: result.body });
	              }

	              next();

	              _context.next = 34;
	              break;

	            case 31:
	              _context.prev = 31;
	              _context.t1 = _context["catch"](0);

	              next(_context.t1);

	            case 34:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 31], [10, 16]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  router.use(function (err, req, res, next) {
	    if (!err) return next();
	    if (err.message === 'NOT_SEASHELL') return next();
	    console.log('SEASHELL PROXY FAIL: \n ' + err.message || err);
	    next(err);
	  });

	  return router;
	};

	exports.seashellProxyMiddleware = seashellProxyMiddleware;

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("lodash/pick");

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.handler = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _html = __webpack_require__(35);

	var _html2 = _interopRequireDefault(_html);

	var _block = __webpack_require__(37);

	var _block2 = _interopRequireDefault(_block);

	var _file = __webpack_require__(38);

	var _file2 = _interopRequireDefault(_file);

	var _redirect = __webpack_require__(39);

	var _redirect2 = _interopRequireDefault(_redirect);

	var _download = __webpack_require__(40);

	var _download2 = _interopRequireDefault(_download);

	var _upload = __webpack_require__(41);

	var _upload2 = _interopRequireDefault(_upload);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var handler = function handler(seashell) {
	  return function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var _res$locals, host, driveId, url, location, _res$locals$location, type, content, handles;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _res$locals = res.locals, host = _res$locals.host, driveId = _res$locals.driveId, url = _res$locals.url, location = _res$locals.location, _res$locals$location = _res$locals.location, type = _res$locals$location.type, content = _res$locals$location.content;
	              handles = {
	                JSON: function JSON() {
	                  return new _promise2.default(function (resolve, reject) {
	                    try {
	                      res.json(location.content);
	                      resolve();
	                    } catch (e) {
	                      reject(e);
	                    }
	                  });
	                },
	                HTML: function HTML() {
	                  return (0, _html2.default)(req, res, content);
	                },
	                BLOCK: function BLOCK() {
	                  return (0, _block2.default)(req, res, content);
	                },
	                FILE: function FILE() {
	                  return (0, _file2.default)(req, res, seashell, driveId, url.pathname, req.path);
	                },
	                REDIRECT: function REDIRECT() {
	                  return (0, _redirect2.default)(req, res, content);
	                },
	                DOWNLOAD: function DOWNLOAD() {
	                  return (0, _download2.default)(req, res, req.query.path);
	                },
	                UPLOAD: function UPLOAD() {
	                  return (0, _upload2.default)(req, res, seashell, content);
	                }
	              };

	              if (handles.hasOwnProperty(type)) {
	                _context.next = 4;
	                break;
	              }

	              return _context.abrupt("return", next(new Error('ILLEGAL_HTTP_REQUEST')));

	            case 4:
	              _context.prev = 4;
	              _context.next = 7;
	              return handles[type]();

	            case 7:
	              _context.next = 14;
	              break;

	            case 9:
	              _context.prev = 9;
	              _context.t0 = _context["catch"](4);

	              if (!(_context.t0.message === 'USE_PROXY')) {
	                _context.next = 13;
	                break;
	              }

	              return _context.abrupt("return", next());

	            case 13:
	              next(_context.t0);

	            case 14:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[4, 9]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }();
	};

	exports.handler = handler;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _ent = __webpack_require__(36);

	var _ent2 = _interopRequireDefault(_ent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 返回html
	 */
	var handleHTML = function handleHTML(req, res, content) {
	  return new _promise2.default(function (resolve) {
	    res.end(_ent2.default.decode(content));
	    resolve();
	  });
	};

	exports.default = handleHTML;

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = require("ent");

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 黑名单域名
	 */
	exports.default = function (req, res, host) {
	  return new _promise2.default(function (resolve, reject) {
	    res.redirect("https://www.google.com/s?q=" + host + " is dangerous.");
	    resolve();
	  });
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 文件下载代理
	 */
	var handleFILE = function handleFILE(req, res, seashell, driveId, pathname, reqpath) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var result;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              result = { body: {} };
	              _context.prev = 1;
	              _context.next = 4;
	              return seashell.requestSelf({
	                headers: { originUrl: '/fs/queryFileContent' },
	                body: { fullPath: '/' + driveId + reqpath }
	              });

	            case 4:
	              result = _context.sent;
	              _context.next = 10;
	              break;

	            case 7:
	              _context.prev = 7;
	              _context.t0 = _context['catch'](1);

	              result.body.error = _context.t0;

	            case 10:
	              _context.prev = 10;

	              if (!result.body.error) {
	                _context.next = 13;
	                break;
	              }

	              return _context.abrupt('return', reject(new Error('NOT_FOUND')));

	            case 13:
	              res.setHeader('CacheControl', true);
	              res.setHeader('maxAge', 31536000000);
	              res.setHeader('Expires', new Date(Date.now() + 31536000000));
	              // console.log(result.body.cat)
	              // console.log(new Buffer(result.body.cat).toString())
	              res.write(new Buffer(result.body.cat));
	              res.end();
	              resolve();
	              _context.next = 25;
	              break;

	            case 21:
	              _context.prev = 21;
	              _context.t1 = _context['catch'](10);

	              console.log(_context.t1);
	              reject(_context.t1);

	            case 25:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[1, 7], [10, 21]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.default = handleFILE;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 重定向
	 */
	exports.default = function (req, res, content) {
	  return new _promise2.default(function (resolve, reject) {
	    res.redirect(content);
	    resolve();
	  });
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 下载文件
	 * @param req
	 * @param res
	 * @param path (req.query.path)
	 */
	exports.default = function (req, res, path) {
	  return new _promise2.default(function (resolve, reject) {
	    if (typeof path === 'undefined') return reject(new Error('PARAMS_LOST'));
	    var rawPath = decodeURI(path);
	    // const result = {path: rawPath};
	    // const truePath = rawPath;
	    res.download(rawPath);
	    resolve();
	  });
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _formidable = __webpack_require__(42);

	var _formidable2 = _interopRequireDefault(_formidable);

	var _path = __webpack_require__(43);

	var _path2 = _interopRequireDefault(_path);

	var _fsPromise = __webpack_require__(12);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (req, res, seashell, options) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	      var uploadKey, driveId, parentId, name, fileId, uploaded, filesFile, fileList, result;
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;

	              /**
	               *  uploadKey: the key in formData, default is 'file'
	               *  uploadDir: the real directory on server, like `/root/gateway/data/app/superuser.youkuohao.com/public/upload`,
	               *  uploadLocation: the prefix for the uploaded file, like `http://superuser.youkuohao.com/upload`
	               * }
	               **/
	              uploadKey = options.uploadKey, driveId = options.driveId, parentId = options.parentId, name = options.name, fileId = options.fileId;

	              /**
	               * 设置上传参数, 处理上传, 返回上传结果 {fields, files}
	               */

	              _context2.next = 4;
	              return new _promise2.default(function (resolve, reject) {
	                var form = new _formidable2.default.IncomingForm();
	                form.encoding = 'utf-8';
	                form.hash = 'md5';
	                form.keepExtensions = true;
	                form.multiples = true;

	                form.parse(req, function (err, fields, files) {
	                  if (err) return reject(err);
	                  resolve({ fields: fields, files: files });
	                });
	              });

	            case 4:
	              uploaded = _context2.sent;


	              /**
	               * 移动文件
	               */
	              filesFile = uploaded.files[uploadKey];

	              if (filesFile) {
	                _context2.next = 8;
	                break;
	              }

	              return _context2.abrupt("return", reject(new Error('UPLOAD_FAIL')));

	            case 8:
	              fileList = filesFile.length > 0 ? filesFile : [filesFile];
	              _context2.next = 11;
	              return _promise2.default.all(fileList.map(function (file) {
	                return new _promise2.default(function () {
	                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	                    var tmpPath, content, transferResult;
	                    return _regenerator2.default.wrap(function _callee$(_context) {
	                      while (1) {
	                        switch (_context.prev = _context.next) {
	                          case 0:
	                            _context.prev = 0;
	                            tmpPath = file.path;
	                            _context.next = 4;
	                            return _fsPromise2.default.readFile(tmpPath);

	                          case 4:
	                            content = _context.sent;
	                            _context.next = 7;
	                            return seashell.requestSelf({
	                              headers: { originUrl: typeof fileId === 'string' ? '/fs/mutateFileContent' : '/fs/mutateInsertOne' },
	                              body: {
	                                fileId: fileId,
	                                parentId: parentId,
	                                driveId: driveId,
	                                content: content,
	                                name: typeof name === 'string' ? name : "" + file.hash + _path2.default.extname(file.name).toLowerCase()
	                              }
	                            });

	                          case 7:
	                            transferResult = _context.sent;

	                            if (!transferResult.body.error) {
	                              _context.next = 10;
	                              break;
	                            }

	                            return _context.abrupt("return", reject(new Error(transferResult.body.error)));

	                          case 10:
	                            _context.next = 12;
	                            return _fsPromise2.default.unlink(tmpPath);

	                          case 12:
	                            resolve(transferResult.body);
	                            _context.next = 18;
	                            break;

	                          case 15:
	                            _context.prev = 15;
	                            _context.t0 = _context["catch"](0);

	                            reject(_context.t0);

	                          case 18:
	                          case "end":
	                            return _context.stop();
	                        }
	                      }
	                    }, _callee, undefined, [[0, 15]]);
	                  }));

	                  return function (_x3, _x4) {
	                    return _ref2.apply(this, arguments);
	                  };
	                }());
	              }));

	            case 11:
	              result = _context2.sent;


	              /** result format:
	               [
	               "https://example.com/upload/IMG_2951.PNG"
	               ]
	               */
	              res.json({ result: result });
	              resolve();
	              _context2.next = 20;
	              break;

	            case 16:
	              _context2.prev = 16;
	              _context2.t0 = _context2["catch"](0);

	              console.log(_context2.t0);
	              reject(_context2.t0);

	            case 20:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined, [[0, 16]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = require("formidable");

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var allActionCreators = {
	  account: {
	    mutateCreateVerificationCode: __webpack_require__(45).default,
	    mutateCreateAuthCode: __webpack_require__(48).default,
	    mutateCreateToken: __webpack_require__(52).default,
	    mutateDeleteToken: __webpack_require__(55).default,
	    session: __webpack_require__(56).default,
	    queryOne: __webpack_require__(53).default,
	    queryAll: __webpack_require__(58).default
	  },
	  fs: {
	    queryFileContent: __webpack_require__(59).default,
	    queryOneByFullPath: __webpack_require__(60).default,
	    queryOneById: __webpack_require__(62).default,
	    queryFile: __webpack_require__(63).default,
	    mutateInsertOne: __webpack_require__(64).default,
	    mutateUpload: __webpack_require__(65).default,
	    mutateDelete: __webpack_require__(66).default,
	    mutateFileContent: __webpack_require__(67).default
	  },
	  drive: {
	    queryOne: __webpack_require__(68).default,
	    queryMeta: __webpack_require__(69).default,
	    queryUsers: __webpack_require__(70).default,
	    queryOneByDomain: __webpack_require__(71).default,
	    queryPermission: __webpack_require__(72).default,
	    mutateCreate: __webpack_require__(73).default,
	    mutateDisableDrive: __webpack_require__(74).default,
	    mutateDomain: __webpack_require__(75).default,
	    mutateInsertOne: __webpack_require__(73).default,
	    mutateLocation: __webpack_require__(76).default,
	    mutateUser: __webpack_require__(77).default
	  },
	  app: {
	    create: __webpack_require__(79).default,
	    remove: __webpack_require__(81).default,
	    get: __webpack_require__(84).default,
	    list: __webpack_require__(85).default,
	    addItem: __webpack_require__(86).default,
	    find: __webpack_require__(87).default,
	    removeItem: __webpack_require__(88).default
	  },
	  socket: {
	    bind: __webpack_require__(89).default,
	    unbind: __webpack_require__(82).default,
	    session: __webpack_require__(90).default,
	    emptyAll: __webpack_require__(91).default,
	    findByAppId: __webpack_require__(93).default
	  }
	};

	exports.default = allActionCreators;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createNumberCode = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _aliPush = __webpack_require__(46);

	var _aliPush2 = _interopRequireDefault(_aliPush);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var client = null;

	/**
	 * 生成数字验证码
	 * @param length 验证码长度
	 */
	var createNumberCode = exports.createNumberCode = function createNumberCode() {
	  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

	  var fill0 = function fill0(str) {
	    return str.length === length ? str : fill0(str + '0');
	  };
	  return fill0(String(Math.random()).substr(2, length));
	};

	/**
	 * @api {POST} /account2/emailcode/createVerificationCode 获取登录验证码
	 * @apiGroup Account
	 * @apiName EmailCodeForLogin
	 * @apiParam {string} email 邮箱
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, email, config, db, code, options;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = _joi2.default.validate(query, _joi2.default.object().keys({
	                  email: _joi2.default.string().required()
	                }), { allowUnknown: true });

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                email = validated.value.email;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _config2.default)();

	              case 7:
	                config = _context.sent;
	                db = getCtx().leveldb.sub('emailcode');
	                code = createNumberCode();
	                _context.next = 12;
	                return db.put(email, { code: code, createTime: Date.now() });

	              case 12:
	                console.log(code, Date.now());

	                options = {
	                  ToAddress: email,
	                  Subject: '验证码',
	                  FromAlias: '右括号',
	                  TextBody: '\u60A8\u7684\u9A8C\u8BC1\u7801\u4E3A' + code
	                };


	                if (!client) {
	                  client = new _aliPush2.default({
	                    AccessKeyId: config.production.aliyun.accessid,
	                    AccessKeySecret: config.production.aliyun.accesskey,
	                    AccountName: config.production.aliyun.dms.accountName
	                  });
	                }

	                client.SingleSendMail(options, function (err, res, body) {
	                  if (err) return reject(err);
	                  resolve({});
	                });

	                _context.next = 21;
	                break;

	              case 18:
	                _context.prev = 18;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 21:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 18]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = require("ali-push");

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = require("joi");

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _crypto = __webpack_require__(51);

	var _crypto2 = _interopRequireDefault(_crypto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */

	var normalCode = function normalCode() {
	  return _crypto2.default.randomBytes(32).toString('hex');
	};

	exports.default = function (_ref) {
	  var token = _ref.token;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, code;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;

	                if (!getCtx().request.headers.session) reject(new Error('ERR_NOT_LOGGED'));
	                db = getCtx().leveldb.sub('ssocode');
	                code = normalCode();
	                _context.next = 6;
	                return db.put(code, { token: token, code: code });

	              case 6:
	                resolve(code);
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
	        }, _callee, undefined, [[0, 9]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _mongodb = __webpack_require__(50);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isConnected = false;
	var isConnecting = false;
	var db = null;

	var connectPromise = function connectPromise(mongodbUrl) {
	  return _mongodb.MongoClient.connect(mongodbUrl, {
	    poolSize: 10,
	    reconnectInterval: 1000,
	    reconnectTries: 1000
	  });
	};

	var reconnect = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
	    var _ref2, mongodbUrl;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            console.log('mongodb reconnecting...');
	            _context.prev = 1;
	            _context.next = 4;
	            return (0, _config2.default)();

	          case 4:
	            _ref2 = _context.sent;
	            mongodbUrl = _ref2.production.mongodbUrl;
	            _context.next = 8;
	            return connectPromise(mongodbUrl);

	          case 8:
	            db = _context.sent;

	            isConnected = true;
	            isConnecting = false;
	            console.log('mongodb reconnect success');
	            attach(db);
	            _context.next = 18;
	            break;

	          case 15:
	            _context.prev = 15;
	            _context.t0 = _context['catch'](1);

	            setTimeout(reconnect, 3000);

	          case 18:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[1, 15]]);
	  }));

	  return function reconnect() {
	    return _ref.apply(this, arguments);
	  };
	}();

	var firstConnect = function firstConnect() {
	  return new _promise2.default(function () {
	    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	      var _ref4, mongodbUrl;

	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;

	              isConnecting = true;
	              _context2.next = 4;
	              return (0, _config2.default)();

	            case 4:
	              _ref4 = _context2.sent;
	              mongodbUrl = _ref4.production.mongodbUrl;
	              _context2.next = 8;
	              return connectPromise(mongodbUrl);

	            case 8:
	              db = _context2.sent;

	              isConnected = true;
	              isConnecting = false;
	              attach(db);
	              resolve(db);
	              _context2.next = 19;
	              break;

	            case 15:
	              _context2.prev = 15;
	              _context2.t0 = _context2['catch'](0);

	              setTimeout(reconnect, 3000);
	              reject(_context2.t0);

	            case 19:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined, [[0, 15]]);
	    }));

	    return function (_x, _x2) {
	      return _ref3.apply(this, arguments);
	    };
	  }());
	};

	var attach = function attach(db) {
	  db.on('error', function (e) {
	    console.log(e);
	  });
	  db.once('close', function () {
	    console.log('mongodb close');
	    db.removeAllListeners();
	    isConnected = false;
	    isConnecting = true;
	    process.nextTick(reconnect);
	  });
	};

	var getMongodb = function getMongodb() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { customError: 'LOST_CONNECTION_TO_MONGODB' };
	  return new _promise2.default(function () {
	    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	      return _regenerator2.default.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              _context3.prev = 0;

	              if (!isConnected) {
	                _context3.next = 3;
	                break;
	              }

	              return _context3.abrupt('return', resolve(db));

	            case 3:
	              if (!isConnecting) {
	                _context3.next = 5;
	                break;
	              }

	              return _context3.abrupt('return', reject(options.customError));

	            case 5:
	              _context3.t0 = resolve;
	              _context3.next = 8;
	              return firstConnect();

	            case 8:
	              _context3.t1 = _context3.sent;
	              (0, _context3.t0)(_context3.t1);
	              _context3.next = 16;
	              break;

	            case 12:
	              _context3.prev = 12;
	              _context3.t2 = _context3['catch'](0);

	              console.error(_context3.t2);
	              reject(options.customError);

	            case 16:
	            case 'end':
	              return _context3.stop();
	          }
	        }
	      }, _callee3, undefined, [[0, 12]]);
	    }));

	    return function (_x4, _x5) {
	      return _ref5.apply(this, arguments);
	    };
	  }());
	};

	exports.default = getMongodb;

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = require("mongodb");

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(53);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _crypto = __webpack_require__(51);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _uuid = __webpack_require__(54);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createTokenByUserId = function createTokenByUserId(userId) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var normalToken, db, nextToken;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              normalToken = function normalToken() {
	                return _crypto2.default.randomBytes(48).toString('hex');
	              };

	              _context.prev = 1;
	              _context.next = 4;
	              return (0, _leveldb2.default)();

	            case 4:
	              db = _context.sent.sub('token');
	              nextToken = { token: normalToken(), userId: userId, updateTime: Date.now() };
	              _context.next = 8;
	              return db.put(nextToken.token, nextToken);

	            case 8:
	              resolve(nextToken);
	              _context.next = 14;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context['catch'](1);

	              reject(_context.t0);

	            case 14:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[1, 11]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	}; /* @public */


	var queryCodeLevel = function queryCodeLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve) {
	      var result, validated;
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;
	              _context2.next = 3;
	              return db.get(key);

	            case 3:
	              result = _context2.sent;
	              validated = _joi2.default.validate(result, _joi2.default.object().keys({
	                code: _joi2.default.string().length(6).required(),
	                createTime: _joi2.default.number().length(14).required()
	              }));

	              if (!validated.error) {
	                _context2.next = 7;
	                break;
	              }

	              return _context2.abrupt('return', resolve(null));

	            case 7:
	              resolve(result);
	              _context2.next = 13;
	              break;

	            case 10:
	              _context2.prev = 10;
	              _context2.t0 = _context2['catch'](0);

	              resolve(null);

	            case 13:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined, [[0, 10]]);
	    }));

	    return function (_x3) {
	      return _ref2.apply(this, arguments);
	    };
	  }());
	};

	/**
	 * 检查验证码
	 */
	var checkCode = function checkCode(_ref3) {
	  var email = _ref3.email,
	      code = _ref3.code;
	  return new _promise2.default(function () {
	    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	      var db, result;
	      return _regenerator2.default.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              _context3.prev = 0;
	              _context3.next = 3;
	              return (0, _leveldb2.default)();

	            case 3:
	              db = _context3.sent.sub('emailcode');
	              _context3.next = 6;
	              return queryCodeLevel(db, email);

	            case 6:
	              result = _context3.sent;

	              if (result) {
	                _context3.next = 9;
	                break;
	              }

	              return _context3.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	            case 9:
	              if (!(result.code !== code)) {
	                _context3.next = 11;
	                break;
	              }

	              return _context3.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	            case 11:
	              if (!(Date.now() > result.createTime + 6000 * 3)) {
	                _context3.next = 13;
	                break;
	              }

	              return _context3.abrupt('return', reject(new Error('EXPIRE_CODE')));

	            case 13:
	              _context3.next = 15;
	              return db.del(email);

	            case 15:
	              resolve(true);
	              _context3.next = 23;
	              break;

	            case 18:
	              _context3.prev = 18;
	              _context3.t0 = _context3['catch'](0);

	              if (!(_context3.t0.name === 'NotFoundError')) {
	                _context3.next = 22;
	                break;
	              }

	              return _context3.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	            case 22:
	              reject(_context3.t0);

	            case 23:
	            case 'end':
	              return _context3.stop();
	          }
	        }
	      }, _callee3, undefined, [[0, 18]]);
	    }));

	    return function (_x4, _x5) {
	      return _ref4.apply(this, arguments);
	    };
	  }());
	};

	/**
	 * @api {POST} /account/createTokenByAuthCode 根据AuthCode获取token
	 * @apiName TokenBySSOCode
	 * @apiGroup Account
	 * @apiParam {string} code code
	 * @apiSuccess {string} token token
	 */
	var createTokenByAuthCode = function createTokenByAuthCode(_ref5) {
	  var authCode = _ref5.authCode;
	  return new _promise2.default(function () {
	    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	      var db, result;
	      return _regenerator2.default.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              _context4.prev = 0;
	              _context4.next = 3;
	              return (0, _leveldb2.default)();

	            case 3:
	              db = _context4.sent.sub('ssocode');
	              _context4.next = 6;
	              return db.get(authCode);

	            case 6:
	              result = _context4.sent;

	              resolve({ token: result.token });
	              _context4.next = 13;
	              break;

	            case 10:
	              _context4.prev = 10;
	              _context4.t0 = _context4['catch'](0);

	              reject(_context4.t0);

	            case 13:
	            case 'end':
	              return _context4.stop();
	          }
	        }
	      }, _callee4, undefined, [[0, 10]]);
	    }));

	    return function (_x6, _x7) {
	      return _ref6.apply(this, arguments);
	    };
	  }());
	};

	var createUser = function createUser(email) {
	  return new _promise2.default(function () {
	    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	      var db, id, value;
	      return _regenerator2.default.wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              _context5.next = 2;
	              return (0, _leveldb2.default)();

	            case 2:
	              db = _context5.sent.sub('user');
	              _context5.prev = 3;
	              id = _uuid2.default.v1();
	              value = {
	                email: email,
	                id: id,
	                userId: id
	              };
	              _context5.next = 8;
	              return db.put(id, value);

	            case 8:
	              resolve(value);
	              _context5.next = 14;
	              break;

	            case 11:
	              _context5.prev = 11;
	              _context5.t0 = _context5['catch'](3);

	              reject(_context5.t0);

	            case 14:
	            case 'end':
	              return _context5.stop();
	          }
	        }
	      }, _callee5, undefined, [[3, 11]]);
	    }));

	    return function (_x8, _x9) {
	      return _ref7.apply(this, arguments);
	    };
	  }());
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    email: _joi2.default.string().required(),
	    driveId: _joi2.default.string().required(),
	    code: _joi2.default.string().length(6).required()
	  }), { allowUnknown: true });
	};

	/**
	 * @api {POST} /account2/token/gettokenbyemailcode 根据email验证码获取token
	 * @apiName TokenByEmailCode
	 * @apiGroup Account
	 * @apiParam {string} code
	 * @apiParam {string} email
	 * @apiSuccess {string} token
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(resolve, reject) {
	        var validated, _validated$value, code, email, driveId, result, userId, db, user;

	        return _regenerator2.default.wrap(function _callee6$(_context6) {
	          while (1) {
	            switch (_context6.prev = _context6.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context6.next = 3;
	                  break;
	                }

	                return _context6.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, code = _validated$value.code, email = _validated$value.email, driveId = _validated$value.driveId;
	                _context6.prev = 4;
	                _context6.next = 7;
	                return checkCode({ email: email, code: code });

	              case 7:
	                _context6.next = 9;
	                return dispatch((0, _queryOne2.default)({ email: email, enableNull: true }));

	              case 9:
	                result = _context6.sent;
	                userId = null;

	                if (result) {
	                  _context6.next = 23;
	                  break;
	                }

	                _context6.next = 14;
	                return _leveldb2.default;

	              case 14:
	                db = _context6.sent.sub('email');
	                _context6.next = 17;
	                return createUser(email);

	              case 17:
	                user = _context6.sent;

	                userId = user.userId;
	                _context6.next = 21;
	                return db.put(email, { userId: user.id, email: email });

	              case 21:
	                _context6.next = 24;
	                break;

	              case 23:
	                userId = result.userId;

	              case 24:
	                _context6.t0 = resolve;
	                _context6.next = 27;
	                return createTokenByUserId(userId, driveId);

	              case 27:
	                _context6.t1 = _context6.sent;
	                (0, _context6.t0)(_context6.t1);
	                _context6.next = 34;
	                break;

	              case 31:
	                _context6.prev = 31;
	                _context6.t2 = _context6['catch'](4);

	                reject(_context6.t2);

	              case 34:
	              case 'end':
	                return _context6.stop();
	            }
	          }
	        }, _callee6, undefined, [[4, 31]]);
	      }));

	      return function (_x10, _x11) {
	        return _ref8.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.queryLevel = exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @private */
	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    email: _joi2.default.string().required(),
	    enableNull: _joi2.default.string().default(false)
	  }));
	};

	var queryLevel = exports.queryLevel = function queryLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.t0 = resolve;
	              _context.next = 4;
	              return db.get(key);

	            case 4:
	              _context.t1 = _context.sent;
	              (0, _context.t0)(_context.t1);
	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t2 = _context['catch'](0);

	              resolve(null);

	            case 11:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 8]]);
	    }));

	    return function (_x) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$value, email, enableNull, db, result;

	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context2.next = 3;
	                  break;
	                }

	                return _context2.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, email = _validated$value.email, enableNull = _validated$value.enableNull;
	                _context2.prev = 4;
	                _context2.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                db = _context2.sent.sub('email');
	                _context2.next = 10;
	                return queryLevel(db, email);

	              case 10:
	                result = _context2.sent;

	                if (!(!result && !enableNull)) {
	                  _context2.next = 13;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 13:
	                resolve(result);
	                _context2.next = 19;
	                break;

	              case 16:
	                _context2.prev = 16;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 19:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 16]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @api {POST} /account/token/logout 注销token
	 * @apiName Logout
	 * @apiGroup Account
	 * @apiParam {string} token token
	 */
	exports.default = function (_ref) {
	  var token = _ref.token;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('token');

	                if (!getCtx().request.headers.session.user) {
	                  _context.next = 5;
	                  break;
	                }

	                _context.next = 5;
	                return db.del(token);

	              case 5:
	                resolve({});
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
	        }, _callee, undefined, [[0, 8]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(57);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */
	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    token: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * @api {POST} /account2/session 获取session信息
	 * @apiName Session
	 * @apiGroup Account
	 * @apiDescription 获取session信息
	 * @apiParam {string} token 令牌
	 * @apiSuccess {object} user
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, token, db, tokendb, userdb, result, user;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                token = validated.value.token;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                db = _context.sent;
	                tokendb = db.sub('token');
	                userdb = db.sub('user');
	                _context.next = 12;
	                return tokendb.get(token);

	              case 12:
	                result = _context.sent;
	                _context.next = 15;
	                return userdb.get(result.userId);

	              case 15:
	                user = _context.sent;

	                resolve((0, _extends3.default)({}, user, { userId: user.id }));
	                _context.next = 24;
	                break;

	              case 19:
	                _context.prev = 19;
	                _context.t0 = _context['catch'](4);

	                if (!(_context.t0.name === 'NotFoundError')) {
	                  _context.next = 23;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('EMPTY_SESSION')));

	              case 23:
	                reject(_context.t0);

	              case 24:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 19]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/extends");

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @api {POST} /account/user/userlist 获取用户列表
	 * @apiName UserList
	 * @apiGroup Account
	 * @apiParam {string} model model名, user
	 */
	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, limit, list;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                try {
	                  db = getCtx().leveldb.sub('user');
	                  limit = query.limit || 20;
	                  list = [];

	                  db.createReadStream({ limit: limit }).on('data', function (item) {
	                    list.push(item.value);
	                  }).on('end', function () {
	                    resolve({ list: list });
	                  });
	                } catch (e) {
	                  reject(e);
	                }

	              case 1:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _queryOneByFullPath = __webpack_require__(60);

	var _queryOneByFullPath2 = _interopRequireDefault(_queryOneByFullPath);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    fullPath: _joi2.default.string(),
	    fileId: _joi2.default.string()
	  }).xor(['fullPath', 'fileId']), { allowUnknown: true });
	};

	var queryLevel = function queryLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.t0 = resolve;
	              _context.next = 4;
	              return db.get(key);

	            case 4:
	              _context.t1 = _context.sent;
	              (0, _context.t0)(_context.t1);
	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t2 = _context['catch'](0);

	              resolve(null);

	            case 11:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 8]]);
	    }));

	    return function (_x) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$value, fullPath, fileId, fileContentdb, indexData, cat;

	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context2.next = 3;
	                  break;
	                }

	                return _context2.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, fullPath = _validated$value.fullPath, fileId = _validated$value.fileId;
	                _context2.prev = 4;
	                _context2.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                fileContentdb = _context2.sent.sub('fileContent');
	                indexData = null;

	                if (fileId) {
	                  _context2.next = 16;
	                  break;
	                }

	                _context2.next = 12;
	                return dispatch((0, _queryOneByFullPath2.default)({
	                  fullPath: fullPath, replaceWithIndexHTMLWhenIsFolder: true
	                }));

	              case 12:
	                indexData = _context2.sent;

	                if (indexData) {
	                  _context2.next = 15;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 15:
	                fileId = indexData.fileId;

	              case 16:
	                _context2.next = 18;
	                return fileContentdb.get(fileId);

	              case 18:
	                cat = _context2.sent;
	                return _context2.abrupt('return', resolve({ isFile: true, cat: cat }));

	              case 22:
	                _context2.prev = 22;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 25:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 22]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(57);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _ms = __webpack_require__(61);

	var _ms2 = _interopRequireDefault(_ms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var queryLevel = function queryLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.t0 = resolve;
	              _context.next = 4;
	              return db.get(key);

	            case 4:
	              _context.t1 = _context.sent;
	              (0, _context.t0)(_context.t1);
	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t2 = _context['catch'](0);

	              resolve(null);

	            case 11:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 8]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    fullPath: _joi2.default.string(), // include driveId
	    replaceWithIndexHTMLWhenIsFolder: _joi2.default.boolean().default(false)
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	        var validated, _validated$value, fullPath, replaceWithIndexHTMLWhenIsFolder, syncIndexData, fileIndex, indexData;

	        return _regenerator2.default.wrap(function _callee4$(_context4) {
	          while (1) {
	            switch (_context4.prev = _context4.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context4.next = 3;
	                  break;
	                }

	                return _context4.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, fullPath = _validated$value.fullPath, replaceWithIndexHTMLWhenIsFolder = _validated$value.replaceWithIndexHTMLWhenIsFolder;

	                syncIndexData = function syncIndexData(fullPath) {
	                  return new _promise2.default(function () {
	                    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve) {
	                      var fileIndex, file, paths, driveId, indexData, parentId, walkDirToFind;
	                      return _regenerator2.default.wrap(function _callee3$(_context3) {
	                        while (1) {
	                          switch (_context3.prev = _context3.next) {
	                            case 0:
	                              _context3.prev = 0;
	                              _context3.next = 3;
	                              return (0, _leveldb2.default)();

	                            case 3:
	                              fileIndex = _context3.sent.sub('fileIndex');
	                              _context3.next = 6;
	                              return (0, _mongodb2.default)();

	                            case 6:
	                              file = _context3.sent.collection('file');
	                              paths = fullPath.split('/').filter(function (item) {
	                                return item !== '';
	                              });

	                              if (!(paths.length === 1)) {
	                                _context3.next = 10;
	                                break;
	                              }

	                              return _context3.abrupt('return', resolve({ name: paths[0], type: 2 }));

	                            case 10:
	                              driveId = paths.shift();
	                              indexData = null;
	                              parentId = null;
	                              /**
	                               * 从左往右，一级目录一级目录查询，直到目标文件
	                               * @param driveId
	                               */

	                              walkDirToFind = function walkDirToFind(driveId) {
	                                return new _promise2.default(function () {
	                                  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	                                    var name, fields, result;
	                                    return _regenerator2.default.wrap(function _callee2$(_context2) {
	                                      while (1) {
	                                        switch (_context2.prev = _context2.next) {
	                                          case 0:
	                                            _context2.prev = 0;
	                                            name = paths.shift();
	                                            fields = [];

	                                            if (paths.length === 0) fields = fields.concat(['tags', 'type']);
	                                            _context2.next = 6;
	                                            return file.findOne({ driveId: driveId, name: name, parentId: parentId }, { fields: fields });

	                                          case 6:
	                                            result = _context2.sent;

	                                            if (result) {
	                                              _context2.next = 9;
	                                              break;
	                                            }

	                                            return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	                                          case 9:
	                                            result.fileId = result._id.toString();

	                                            if (!(paths.length === 0)) {
	                                              _context2.next = 12;
	                                              break;
	                                            }

	                                            return _context2.abrupt('return', resolve(result));

	                                          case 12:
	                                            parentId = result.fileId;
	                                            _context2.t0 = resolve;
	                                            _context2.next = 16;
	                                            return walkDirToFind(driveId);

	                                          case 16:
	                                            _context2.t1 = _context2.sent;
	                                            (0, _context2.t0)(_context2.t1);
	                                            _context2.next = 23;
	                                            break;

	                                          case 20:
	                                            _context2.prev = 20;
	                                            _context2.t2 = _context2['catch'](0);

	                                            reject(_context2.t2);

	                                          case 23:
	                                          case 'end':
	                                            return _context2.stop();
	                                        }
	                                      }
	                                    }, _callee2, undefined, [[0, 20]]);
	                                  }));

	                                  return function (_x6, _x7) {
	                                    return _ref4.apply(this, arguments);
	                                  };
	                                }());
	                              };

	                              _context3.prev = 14;
	                              _context3.next = 17;
	                              return walkDirToFind(driveId);

	                            case 17:
	                              indexData = _context3.sent;
	                              _context3.next = 23;
	                              break;

	                            case 20:
	                              _context3.prev = 20;
	                              _context3.t0 = _context3['catch'](14);

	                              indexData = { error: 'NOT_FOUND' };

	                            case 23:
	                              indexData = (0, _extends3.default)({}, indexData, { updateTime: Date.now() });
	                              _context3.next = 26;
	                              return fileIndex.put(fullPath, indexData);

	                            case 26:
	                              resolve(indexData);

	                              _context3.next = 32;
	                              break;

	                            case 29:
	                              _context3.prev = 29;
	                              _context3.t1 = _context3['catch'](0);

	                              resolve({ error: 'NOT_FOUND' });

	                            case 32:
	                            case 'end':
	                              return _context3.stop();
	                          }
	                        }
	                      }, _callee3, undefined, [[0, 29], [14, 20]]);
	                    }));

	                    return function (_x5) {
	                      return _ref3.apply(this, arguments);
	                    };
	                  }());
	                };

	                _context4.prev = 5;
	                _context4.next = 8;
	                return (0, _leveldb2.default)();

	              case 8:
	                fileIndex = _context4.sent.sub('fileIndex');
	                _context4.next = 11;
	                return queryLevel(fileIndex, fullPath);

	              case 11:
	                indexData = _context4.sent;

	                if (!(!indexData || Date.now() > indexData.updateTime + (0, _ms2.default)('1s') || !indexData.updateTime)) {
	                  _context4.next = 16;
	                  break;
	                }

	                _context4.next = 15;
	                return syncIndexData(fullPath);

	              case 15:
	                indexData = _context4.sent;

	              case 16:
	                if (!indexData.error) {
	                  _context4.next = 18;
	                  break;
	                }

	                return _context4.abrupt('return', reject(new Error(indexData.error)));

	              case 18:
	                if (!(indexData.type === 2 && replaceWithIndexHTMLWhenIsFolder)) {
	                  _context4.next = 23;
	                  break;
	                }

	                fullPath = fullPath + '/index.html';
	                _context4.next = 22;
	                return syncIndexData(fullPath);

	              case 22:
	                indexData = _context4.sent;

	              case 23:
	                resolve(indexData);
	                _context4.next = 29;
	                break;

	              case 26:
	                _context4.prev = 26;
	                _context4.t0 = _context4['catch'](5);

	                reject(_context4.t0);

	              case 29:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, undefined, [[5, 26]]);
	      }));

	      return function (_x3, _x4) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = require("ms");

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = exports.walkToBuildPrevFullPath = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(50);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var walkToBuildPrevFullPath = exports.walkToBuildPrevFullPath = function walkToBuildPrevFullPath(currentPath, fileId) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var file, fileData, name, parentId;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return (0, _mongodb2.default)();

	            case 3:
	              file = _context.sent.collection('file');
	              _context.next = 6;
	              return file.findOne({ _id: (0, _mongodb3.ObjectId)(fileId) });

	            case 6:
	              fileData = _context.sent;
	              name = fileData.name, parentId = fileData.parentId;

	              currentPath = name + '/' + currentPath;

	              if (!parentId) {
	                _context.next = 15;
	                break;
	              }

	              _context.t0 = resolve;
	              _context.next = 13;
	              return walkToBuildPrevFullPath(currentPath, parentId);

	            case 13:
	              _context.t1 = _context.sent;
	              return _context.abrupt('return', (0, _context.t0)(_context.t1));

	            case 15:
	              resolve(currentPath);
	              _context.next = 21;
	              break;

	            case 18:
	              _context.prev = 18;
	              _context.t2 = _context['catch'](0);

	              reject(_context.t2);

	            case 21:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 18]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    fileId: _joi2.default.string().required(),
	    includePath: _joi2.default.boolean().default(false)
	  }));
	};

	exports.default = function (query) {
	  return function (dispatch) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$value, includePath, fileId, file, fileData, name, parentId;

	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context2.next = 3;
	                  break;
	                }

	                return _context2.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, includePath = _validated$value.includePath, fileId = _validated$value.fileId;
	                _context2.prev = 4;
	                _context2.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                file = _context2.sent.collection('file');
	                _context2.next = 10;
	                return file.findOne({ _id: (0, _mongodb3.ObjectId)(fileId) });

	              case 10:
	                fileData = _context2.sent;

	                if (fileData) {
	                  _context2.next = 13;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 13:
	                if (!includePath) {
	                  _context2.next = 20;
	                  break;
	                }

	                name = fileData.name, parentId = fileData.parentId;

	                if (!fileData.parentId) {
	                  _context2.next = 19;
	                  break;
	                }

	                _context2.next = 18;
	                return walkToBuildPrevFullPath(name, parentId);

	              case 18:
	                name = _context2.sent;

	              case 19:
	                fileData.fullPath = '/' + fileData.driveId + '/' + name;

	              case 20:
	                resolve(fileData);
	                _context2.next = 26;
	                break;

	              case 23:
	                _context2.prev = 23;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 26:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 23]]);
	      }));

	      return function (_x3, _x4) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(57);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(50);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    keywords: _joi2.default.string().default(''),
	    tags: _joi2.default.string().default(''),
	    limit: _joi2.default.number().default(200),
	    driveId: _joi2.default.string(),
	    parentId: _joi2.default.string().allow(null),
	    replaceWithFileMetaIfIsFile: _joi2.default.boolean().default(false),
	    fields: _joi2.default.array().default(['name', 'type'])
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, keywords, tags, limit, fields, parentId, driveId, replaceWithFileMetaIfIsFile, filedb, parentMeta, keywordRegex, filter, data;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, keywords = _validated$value.keywords, tags = _validated$value.tags, limit = _validated$value.limit, fields = _validated$value.fields, parentId = _validated$value.parentId, driveId = _validated$value.driveId, replaceWithFileMetaIfIsFile = _validated$value.replaceWithFileMetaIfIsFile;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                filedb = _context.sent.collection('file');

	                if (!parentId) {
	                  _context.next = 18;
	                  break;
	                }

	                _context.next = 11;
	                return filedb.findOne({ _id: (0, _mongodb3.ObjectId)(parentId) });

	              case 11:
	                parentMeta = _context.sent;

	                if (parentMeta) {
	                  _context.next = 14;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('PARENT_NOT_EXIST')));

	              case 14:
	                if (!(parentMeta.type === 1)) {
	                  _context.next = 18;
	                  break;
	                }

	                if (!replaceWithFileMetaIfIsFile) {
	                  _context.next = 17;
	                  break;
	                }

	                return _context.abrupt('return', resolve((0, _extends3.default)({}, parentMeta, { isFile: true })));

	              case 17:
	                return _context.abrupt('return', reject(new Error('ILLEGAL_PARENT')));

	              case 18:
	                keywordRegex = keywords.split(' ').join('|');
	                filter = {
	                  driveId: driveId,
	                  parentId: parentId,
	                  $or: []
	                };


	                if (tags) filter.$or.push({ tags: { $regex: tags.split(',').join('|') } });
	                if (keywords) {
	                  filter.$or.push({ name: { $regex: keywordRegex } });
	                  filter.$or.push({ tags: { $regex: keywordRegex } });
	                }

	                if (filter.$or.length === 0) delete filter.$or;

	                _context.next = 25;
	                return filedb.find(filter, fields).limit(limit).toArray();

	              case 25:
	                data = _context.sent;

	                resolve({ data: data });
	                _context.next = 32;
	                break;

	              case 29:
	                _context.prev = 29;
	                _context.t0 = _context['catch'](4);
	                return _context.abrupt('return', reject(_context.t0));

	              case 32:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 29]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _queryOneByFullPath = __webpack_require__(60);

	var _queryOneByFullPath2 = _interopRequireDefault(_queryOneByFullPath);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    name: _joi2.default.string().required(),
	    parentId: _joi2.default.string().allow(null).default(null),
	    driveId: _joi2.default.string().required(),
	    content: _joi2.default.any(),
	    type: _joi2.default.number().default(1) }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, driveId, type, parentId, name, content, fileContent, file, result0, result, id;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, driveId = _validated$value.driveId, type = _validated$value.type, parentId = _validated$value.parentId, name = _validated$value.name, content = _validated$value.content;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                fileContent = _context.sent.sub('fileContent');
	                _context.next = 10;
	                return (0, _mongodb2.default)();

	              case 10:
	                file = _context.sent.collection('file');
	                _context.next = 13;
	                return file.findOne({ driveId: driveId, parentId: parentId, name: name });

	              case 13:
	                result0 = _context.sent;

	                if (!result0) {
	                  _context.next = 18;
	                  break;
	                }

	                console.log(validated.value);
	                console.log(result0);
	                return _context.abrupt('return', reject(new Error('FILE_EXIST')));

	              case 18:
	                _context.next = 20;
	                return file.insertOne({ driveId: driveId, type: type, parentId: parentId, name: name });

	              case 20:
	                result = _context.sent;
	                id = result.insertedId.toString();

	                if (!(type === 1)) {
	                  _context.next = 25;
	                  break;
	                }

	                _context.next = 25;
	                return fileContent.put(id, content);

	              case 25:
	                resolve(result.ops[0]);
	                _context.next = 31;
	                break;

	              case 28:
	                _context.prev = 28;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 31:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 28]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _path = __webpack_require__(43);

	var _path2 = _interopRequireDefault(_path);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mutateInsertOne = __webpack_require__(64);

	var _mutateInsertOne2 = _interopRequireDefault(_mutateInsertOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.string().required(),
	    fileId: _joi2.default.string(), // 如果有fileId, 那么name, parentId都失效
	    name: _joi2.default.string(),
	    parentId: _joi2.default.string().allow(null).default(null),
	    uploadKey: _joi2.default.string().default('file')
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, driveId, parentId, uploadKey, fileId, name;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, driveId = _validated$value.driveId, parentId = _validated$value.parentId, uploadKey = _validated$value.uploadKey, fileId = _validated$value.fileId, name = _validated$value.name;

	                getCtx().setHeader({ __UPLOAD: true });

	                try {
	                  resolve({ parentId: parentId, driveId: driveId, uploadKey: uploadKey, fileId: fileId, name: name });
	                } catch (e) {
	                  reject(e);
	                }

	              case 6:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb3 = __webpack_require__(50);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    fileId: _joi2.default.string().required(),
	    driveId: _joi2.default.string()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, driveId, fileId, filedb, result, fileContentdb;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, driveId = _validated$value.driveId, fileId = _validated$value.fileId;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                filedb = _context.sent.collection('file');
	                _context.next = 10;
	                return filedb.findOneAndDelete({ _id: (0, _mongodb3.ObjectId)(fileId) });

	              case 10:
	                result = _context.sent;

	                if (!(result.value.type === 1)) {
	                  _context.next = 17;
	                  break;
	                }

	                _context.next = 14;
	                return (0, _leveldb2.default)();

	              case 14:
	                fileContentdb = _context.sent.sub('fileContent');
	                _context.next = 17;
	                return fileContentdb.del(fileId);

	              case 17:
	                resolve(result);
	                _context.next = 23;
	                break;

	              case 20:
	                _context.prev = 20;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 23:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 20]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    fileId: _joi2.default.string().required(),
	    content: _joi2.default.any()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, fileId, content, fileContentdb;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, fileId = _validated$value.fileId, content = _validated$value.content;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                fileContentdb = _context.sent.sub('fileContent');
	                _context.next = 10;
	                return fileContentdb.put(fileId, content);

	              case 10:
	                resolve({ success: 1 });
	                _context.next = 16;
	                break;

	              case 13:
	                _context.prev = 13;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 16:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 13]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _mongodb2 = __webpack_require__(49);

	var _mongodb3 = _interopRequireDefault(_mongodb2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    domain: _joi2.default.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/),
	    name: _joi2.default.string().regex(/^[a-z]{1,1}[a-z0-9]{2,30}$/),
	    driveId: _joi2.default.string(),
	    fields: _joi2.default.array().default(['name'])
	  }).xor('domain', 'driveId', 'name'), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, geCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, domain, driveId, name, fields, drive, filter;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, domain = _validated$value.domain, driveId = _validated$value.driveId, name = _validated$value.name, fields = _validated$value.fields;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb3.default)();

	              case 7:
	                drive = _context.sent.collection('drive');
	                filter = driveId ? { _id: (0, _mongodb.ObjectId)(driveId) } : name ? { name: name } : { domains: { $elemMatch: { $eq: domain } } };
	                _context.t0 = resolve;
	                _context.next = 12;
	                return drive.findOne(filter, { fields: fields });

	              case 12:
	                _context.t1 = _context.sent;
	                (0, _context.t0)(_context.t1);
	                _context.next = 19;
	                break;

	              case 16:
	                _context.prev = 16;
	                _context.t2 = _context['catch'](4);

	                reject(_context.t2);

	              case 19:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 16]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _mongodb2 = __webpack_require__(49);

	var _mongodb3 = _interopRequireDefault(_mongodb2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    limit: _joi2.default.number().default(20),
	    fields: _joi2.default.array().default(['name', 'locations'])
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, limit, fields, filter, session, userId, drive, data;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, limit = _validated$value.limit, fields = _validated$value.fields;
	                filter = {};
	                session = getCtx().request.headers.session;

	                if (session) {
	                  _context.next = 8;
	                  break;
	                }

	                return _context.abrupt('return', reject('PERMISSION_DENIED'));

	              case 8:
	                userId = session.userId;

	                filter.users = { $elemMatch: { $eq: userId } };

	                _context.prev = 10;
	                _context.next = 13;
	                return (0, _mongodb3.default)();

	              case 13:
	                drive = _context.sent.collection('drive');
	                _context.next = 16;
	                return drive.find(filter, { fields: fields }).limit(limit).toArray();

	              case 16:
	                data = _context.sent;

	                resolve({ data: data });
	                _context.next = 23;
	                break;

	              case 20:
	                _context.prev = 20;
	                _context.t0 = _context['catch'](10);

	                reject(_context.t0);

	              case 23:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[10, 20]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _mongodb2 = __webpack_require__(49);

	var _mongodb3 = _interopRequireDefault(_mongodb2);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _queryOne = __webpack_require__(53);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.string()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, geCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, driveId, drive, filter, result, userdb, data;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                driveId = validated.value.driveId;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb3.default)();

	              case 7:
	                drive = _context.sent.collection('drive');
	                filter = { _id: (0, _mongodb.ObjectId)(driveId) };
	                _context.next = 11;
	                return drive.findOne(filter, { fields: { users: 1 } });

	              case 11:
	                result = _context.sent;

	                if (result) {
	                  _context.next = 14;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 14:
	                _context.next = 16;
	                return (0, _leveldb2.default)();

	              case 16:
	                userdb = _context.sent.sub('user');
	                _context.next = 19;
	                return _promise2.default.all(result.users.map(function (userId) {
	                  return (0, _queryOne.queryLevel)(userdb, userId);
	                }));

	              case 19:
	                data = _context.sent;

	                data = data.filter(function (item) {
	                  return item !== null;
	                });
	                resolve({ data: data });
	                _context.next = 27;
	                break;

	              case 24:
	                _context.prev = 24;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 27:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 24]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(57);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _queryOne = __webpack_require__(68);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _config = __webpack_require__(9);

	var _config2 = _interopRequireDefault(_config);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _ms = __webpack_require__(61);

	var _ms2 = _interopRequireDefault(_ms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var queryLevel = function queryLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      var result, validated;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return db.get(key);

	            case 3:
	              result = _context.sent;
	              validated = _joi2.default.validate(result, _joi2.default.object().keys({
	                updateTime: _joi2.default.number().required(),
	                driveId: _joi2.default.string().required(),
	                locations: _joi2.default.array().required()
	              }));

	              if (!validated.error) {
	                _context.next = 7;
	                break;
	              }

	              return _context.abrupt('return', resolve(null));

	            case 7:
	              resolve(result);
	              _context.next = 13;
	              break;

	            case 10:
	              _context.prev = 10;
	              _context.t0 = _context['catch'](0);

	              resolve(null);

	            case 13:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 10]]);
	    }));

	    return function (_x) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    domain: _joi2.default.required(),
	    forceSync: _joi2.default.boolean().default(false) // 强制更新（有很短的延迟）
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	        var validated, _validated$value, domain, forceSync, syncCache, db, target;

	        return _regenerator2.default.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context3.next = 3;
	                  break;
	                }

	                return _context3.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, domain = _validated$value.domain, forceSync = _validated$value.forceSync;

	                syncCache = function () {
	                  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
	                    var pageDomain, pageDomainRegex, index, filter, driveData, cacheValue, db;
	                    return _regenerator2.default.wrap(function _callee2$(_context2) {
	                      while (1) {
	                        switch (_context2.prev = _context2.next) {
	                          case 0:
	                            _context2.prev = 0;
	                            _context2.next = 3;
	                            return (0, _config2.default)();

	                          case 3:
	                            pageDomain = _context2.sent.production.pageDomain;
	                            pageDomainRegex = new RegExp('.' + pageDomain + '$');
	                            index = domain.search(pageDomainRegex);
	                            filter = index === -1 ? { domain: domain } : {
	                              name: domain.substring(0, index)
	                            };
	                            _context2.next = 9;
	                            return dispatch((0, _queryOne2.default)((0, _extends3.default)({}, filter, { fields: ['locations'] })));

	                          case 9:
	                            driveData = _context2.sent;
	                            cacheValue = {
	                              updateTime: Date.now()
	                            };

	                            if (!driveData) {
	                              cacheValue.disable = true;
	                            } else {
	                              cacheValue.driveId = driveData._id.toString();
	                              cacheValue.locations = driveData.locations;
	                            }

	                            _context2.next = 14;
	                            return (0, _leveldb2.default)();

	                          case 14:
	                            db = _context2.sent.sub('domain');
	                            _context2.next = 17;
	                            return db.put(domain, cacheValue);

	                          case 17:
	                            _context2.next = 22;
	                            break;

	                          case 19:
	                            _context2.prev = 19;
	                            _context2.t0 = _context2['catch'](0);

	                            console.log(_context2.t0);

	                          case 22:
	                          case 'end':
	                            return _context2.stop();
	                        }
	                      }
	                    }, _callee2, undefined, [[0, 19]]);
	                  }));

	                  return function syncCache() {
	                    return _ref3.apply(this, arguments);
	                  };
	                }();

	                _context3.prev = 5;
	                _context3.next = 8;
	                return (0, _leveldb2.default)();

	              case 8:
	                db = _context3.sent.sub('domain');
	                _context3.next = 11;
	                return queryLevel(db, domain);

	              case 11:
	                target = _context3.sent;

	                if (!(!target || target.disable)) {
	                  _context3.next = 15;
	                  break;
	                }

	                reject(new Error('NOT_FOUND'));
	                return _context3.abrupt('return', process.nextTick(syncCache));

	              case 15:
	                resolve(target);
	                if (forceSync || Date.now() > target.updateTime + (0, _ms2.default)('1s')) process.nextTick(syncCache);
	                _context3.next = 22;
	                break;

	              case 19:
	                _context3.prev = 19;
	                _context3.t0 = _context3['catch'](5);

	                reject(_context3.t0);

	              case 22:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, undefined, [[5, 19]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(68);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    userId: _joi2.default.string().required(),
	    driveId: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * 获取空间和用户的权限关系
	 * @param query
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, userId, driveId, driveData;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, userId = _validated$value.userId, driveId = _validated$value.driveId;
	                _context.prev = 4;
	                _context.next = 7;
	                return dispatch((0, _queryOne2.default)({ driveId: driveId, fields: ['users', 'adminId'] }));

	              case 7:
	                driveData = _context.sent;

	                if (driveData) {
	                  _context.next = 10;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 10:
	                if (!driveData.users.includes(userId)) {
	                  _context.next = 12;
	                  break;
	                }

	                return _context.abrupt('return', resolve({ success: 1 }));

	              case 12:
	                reject(new Error('PERMISSION_DENIED'));
	                _context.next = 18;
	                break;

	              case 15:
	                _context.prev = 15;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 18:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 15]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(68);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    name: _joi2.default.string().regex(/^[a-z]{1,1}[a-z0-9]{5,30}$/).required(),
	    description: _joi2.default.string().default('')
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, name, description, session, userId, driveData, drive, result;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, name = _validated$value.name, description = _validated$value.description;
	                _context.prev = 4;
	                session = getCtx().request.headers.session;

	                if (session) {
	                  _context.next = 8;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 8:
	                userId = session ? session.userId : '123';
	                _context.next = 11;
	                return dispatch((0, _queryOne2.default)({ name: name }));

	              case 11:
	                driveData = _context.sent;

	                if (!driveData) {
	                  _context.next = 14;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('NAME_EXIST')));

	              case 14:
	                _context.next = 16;
	                return (0, _mongodb2.default)();

	              case 16:
	                drive = _context.sent.collection('drive');
	                _context.next = 19;
	                return drive.insertOne({
	                  name: name,
	                  description: description,
	                  domains: [],
	                  locations: [],
	                  users: [userId],
	                  adminId: userId,
	                  status: 1 });

	              case 19:
	                result = _context.sent;

	                resolve(result.ops[0]);
	                _context.next = 26;
	                break;

	              case 23:
	                _context.prev = 23;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 26:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 23]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(50);

	var _mongodb2 = __webpack_require__(49);

	var _mongodb3 = _interopRequireDefault(_mongodb2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, driveId, drive;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);
	                driveId = validated.value.driveId;
	                _context.prev = 2;
	                _context.next = 5;
	                return (0, _mongodb3.default)();

	              case 5:
	                drive = _context.sent.collection('drive');
	                _context.next = 8;
	                return drive.findOneAndUpdate({ _id: (0, _mongodb.ObjectId)(driveId) }, { $set: { status: 0 } });

	              case 8:
	                resolve({ ok: 'ok' });
	                _context.next = 14;
	                break;

	              case 11:
	                _context.prev = 11;
	                _context.t0 = _context['catch'](2);

	                reject(_context.t0);

	              case 14:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[2, 11]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb3 = __webpack_require__(50);

	var _queryOne = __webpack_require__(68);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.object().required(),
	    add: _joi2.default.array().default([]),
	    remove: _joi2.default.array().default([])
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, driveId, add, remove, db, driveData, nextDomains;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, driveId = _validated$value.driveId, add = _validated$value.add, remove = _validated$value.remove;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                db = _context.sent.collection('drive');
	                _context.next = 10;
	                return dispatch((0, _queryOne2.default)({ driveId: driveId, fields: ['domains'] }));

	              case 10:
	                driveData = _context.sent;

	                if (driveData) {
	                  _context.next = 13;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('DRIVE_NOT_FOUND')));

	              case 13:
	                nextDomains = driveData.domains.slice().filter(function (item) {
	                  return remove.includes(item);
	                }).concat(add);
	                _context.next = 16;
	                return db.findOneAndUpdate({ _id: (0, _mongodb3.ObjectId)(driveId) }, { $set: { domains: nextDomains } });

	              case 16:
	                resolve({});
	                _context.next = 22;
	                break;

	              case 19:
	                _context.prev = 19;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 22:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 19]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.string().required(),
	    locations: _joi2.default.array().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, locations, driveId, db, location, userId;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, locations = _validated$value.locations, driveId = _validated$value.driveId;
	                _context.prev = 4;
	                db = getCtx().leveldb.sub('location');
	                _context.next = 8;
	                return db.get(driveId);

	              case 8:
	                location = _context.sent;
	                userId = getCtx().request.headers.session.userId;

	                location.users = location.users.filter(function (item) {
	                  return item !== userId;
	                }).concat([userId]);
	                location.locations = locations;
	                _context.next = 14;
	                return db.put(driveId, location);

	              case 14:
	                resolve({ success: 1 });
	                _context.next = 20;
	                break;

	              case 17:
	                _context.prev = 17;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 20:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 17]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(49);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(50);

	var _union = __webpack_require__(78);

	var _union2 = _interopRequireDefault(_union);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    driveId: _joi2.default.string().required(),
	    add: _joi2.default.array().default([]),
	    remove: _joi2.default.array().default([])
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, driveId, add, remove, db, driveData, currentUsers, nextUsers;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, driveId = _validated$value.driveId, add = _validated$value.add, remove = _validated$value.remove;
	                _context.prev = 4;

	                if (!(add.length > 0 || remove.length > 0)) {
	                  _context.next = 20;
	                  break;
	                }

	                _context.next = 8;
	                return (0, _mongodb2.default)();

	              case 8:
	                db = _context.sent.collection('drive');
	                _context.next = 11;
	                return db.findOne({ _id: (0, _mongodb3.ObjectId)(driveId) });

	              case 11:
	                driveData = _context.sent;

	                if (driveData) {
	                  _context.next = 14;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 14:
	                currentUsers = driveData.users;
	                nextUsers = (0, _union2.default)(currentUsers.filter(function (item) {
	                  return !remove.includes(item);
	                }).concat(add));

	                if (nextUsers.includes(driveData.adminId)) {
	                  _context.next = 18;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('CANNOT_DELETE_ADMIN')));

	              case 18:
	                _context.next = 20;
	                return db.findOneAndUpdate({ _id: (0, _mongodb3.ObjectId)(driveId) }, { $set: { users: nextUsers } });

	              case 20:
	                resolve({ success: 1 });
	                _context.next = 26;
	                break;

	              case 23:
	                _context.prev = 23;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 26:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 23]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("lodash/union");

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _shouldNotFound = __webpack_require__(80);

	var _shouldNotFound2 = _interopRequireDefault(_shouldNotFound);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, db, appName, app;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = _joi2.default.validate(query, _joi2.default.object.keys({
	                  appName: _joi2.default.string().required()
	                }), { allowUnknown: true });

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                db = getCtx().leveldb.sub('app');
	                appName = validated.value.appName;
	                _context.prev = 5;
	                app = {
	                  appName: appName,
	                  permission: [],
	                  list: []
	                };
	                _context.next = 9;
	                return dispatch((0, _shouldNotFound2.default)({ appName: appName }));

	              case 9:
	                _context.next = 11;
	                return db.put(appName, app);

	              case 11:
	                resolve(app);
	                _context.next = 17;
	                break;

	              case 14:
	                _context.prev = 14;
	                _context.t0 = _context['catch'](5);

	                reject(_context.t0);

	              case 17:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[5, 14]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @private */

	exports.default = function (_ref) {
	  var appName = _ref.appName;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('app');
	                _context.next = 4;
	                return db.get(appName);

	              case 4:
	                reject(new Error('APP_HAS_EXIST'));
	                _context.next = 12;
	                break;

	              case 7:
	                _context.prev = 7;
	                _context.t0 = _context['catch'](0);

	                if (!(_context.t0.name === 'NotFoundError')) {
	                  _context.next = 11;
	                  break;
	                }

	                return _context.abrupt('return', resolve());

	              case 11:
	                reject(_context.t0);

	              case 12:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 7]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _unbind = __webpack_require__(82);

	var _unbind2 = _interopRequireDefault(_unbind);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (_ref) {
	  var appName = _ref.appName;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var db, detail;
	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                db = getCtx().leveldb.sub('app');
	                _context2.prev = 1;
	                _context2.next = 4;
	                return db.del(appName);

	              case 4:
	                detail = _context2.sent;
	                _context2.next = 7;
	                return _promise2.default.all(detail.list.map(function (item) {
	                  return new _promise2.default(function () {
	                    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	                      return _regenerator2.default.wrap(function _callee$(_context) {
	                        while (1) {
	                          switch (_context.prev = _context.next) {
	                            case 0:
	                              if (!(item.socketId === '')) {
	                                _context.next = 2;
	                                break;
	                              }

	                              return _context.abrupt('return', resolve());

	                            case 2:
	                              _context.prev = 2;
	                              _context.next = 5;
	                              return dispatch((0, _unbind2.default)({ socketId: item.socketId }));

	                            case 5:
	                              resolve();
	                              _context.next = 11;
	                              break;

	                            case 8:
	                              _context.prev = 8;
	                              _context.t0 = _context['catch'](2);

	                              reject(_context.t0);

	                            case 11:
	                            case 'end':
	                              return _context.stop();
	                          }
	                        }
	                      }, _callee, undefined, [[2, 8]]);
	                    }));

	                    return function (_x3, _x4) {
	                      return _ref3.apply(this, arguments);
	                    };
	                  }());
	                }));

	              case 7:

	                resolve(detail || {});
	                _context2.next = 13;
	                break;

	              case 10:
	                _context2.prev = 10;
	                _context2.t0 = _context2['catch'](1);

	                reject(_context2.t0);

	              case 13:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[1, 10]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _update = __webpack_require__(83);

	var _update2 = _interopRequireDefault(_update);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * delete socket
	 */
	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, socketId, db, socketInfo, app;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                validated = _joi2.default.validate(query, _joi2.default.object.keys({
	                  socketId: _joi2.default.string().required()
	                }));

	                if (!validated.error) {
	                  _context.next = 4;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 4:
	                socketId = validated.value.socketId;
	                db = getCtx().leveldb.sub('socket');
	                _context.next = 8;
	                return db.get(socketId);

	              case 8:
	                socketInfo = _context.sent;
	                _context.next = 11;
	                return db.del(socketId);

	              case 11:
	                _context.next = 13;
	                return dispatch((0, _update2.default)({ appName: socketInfo.appName }));

	              case 13:
	                app = _context.sent;

	                app.list = app.list.map(function (item) {
	                  if (item.appId === socketInfo.appId) {
	                    item.socketId = '';
	                    item.status = 0;
	                  }
	                  return item;
	                });
	                _context.next = 17;
	                return dispatch((0, _update2.default)({ appName: socketInfo.appName, app: app }));

	              case 17:
	                resolve(1);
	                _context.next = 23;
	                break;

	              case 20:
	                _context.prev = 20;
	                _context.t0 = _context['catch'](0);

	                reject(_context.t0);

	              case 23:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 20]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _leveldb = __webpack_require__(14);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */
	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().required(),
	    app: _joi2.default.object().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, appName, app, db;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 3;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 3:
	                _context.prev = 3;
	                appName = query.appName, app = query.app;
	                _context.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                db = _context.sent.sub('app');
	                _context.next = 10;
	                return db.put(appName, app);

	              case 10:
	                resolve({ success: 1 });

	                _context.next = 16;
	                break;

	              case 13:
	                _context.prev = 13;
	                _context.t0 = _context['catch'](3);

	                reject(_context.t0);

	              case 16:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[3, 13]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * get app detail
	 * @returns {Promise}
	 */
	exports.default = function (_ref) {
	  var appName = _ref.appName;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, detail;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                db = getCtx().leveldb.sub('app');
	                _context.prev = 1;
	                _context.next = 4;
	                return db.get(appName);

	              case 4:
	                detail = _context.sent;

	                resolve(detail);
	                _context.next = 13;
	                break;

	              case 8:
	                _context.prev = 8;
	                _context.t0 = _context['catch'](1);

	                if (!(_context.t0.name !== 'NotFoundError')) {
	                  _context.next = 12;
	                  break;
	                }

	                return _context.abrupt('return', reject('APP_NOT_CREATED'));

	              case 12:
	                reject(_context.t0);

	              case 13:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[1, 8]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * get app list
	 * @returns {Promise}
	 */
	exports.default = function (_ref) {
	  var _ref$limit = _ref.limit,
	      limit = _ref$limit === undefined ? 20 : _ref$limit;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, list;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                try {
	                  db = getCtx().leveldb.sub('app');
	                  list = [];

	                  db.createReadStream({ limit: null }).on('data', function (data) {
	                    list.push(data);
	                  }).on('error', function (e) {
	                    console.log(e);
	                  }).on('end', function () {
	                    resolve({ list: list });
	                  });
	                } catch (e) {
	                  reject(e);
	                }

	              case 1:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _uuid = __webpack_require__(54);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _crypto = __webpack_require__(51);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _get = __webpack_require__(84);

	var _get2 = _interopRequireDefault(_get);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _update = __webpack_require__(83);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var createSecret = function createSecret() {
	  return _crypto2.default.randomBytes(512).toString('hex');
	};

	/**
	 * app create
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, appName, nextService, app;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                validated = _joi2.default.validate(query, _joi2.default.object().keys({
	                  appName: _joi2.default.string().required()
	                }), { allowUnknown: true });

	                if (!validated.error) {
	                  _context.next = 4;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 4:
	                appName = validated.value.appName;
	                nextService = {
	                  appId: _uuid2.default.v1(),
	                  appName: appName,
	                  appSecret: createSecret().toString(10)
	                };
	                _context.next = 8;
	                return dispatch((0, _get2.default)({ appName: appName }));

	              case 8:
	                app = _context.sent;

	                app.list.push({
	                  appId: nextService.appId,
	                  appSecret: nextService.appSecret,
	                  socketId: '',
	                  status: 0
	                });

	                _context.next = 12;
	                return dispatch((0, _update2.default)({ appName: appName, app: app }));

	              case 12:
	                resolve(nextService);
	                _context.next = 18;
	                break;

	              case 15:
	                _context.prev = 15;
	                _context.t0 = _context['catch'](0);

	                reject(_context.t0);

	              case 18:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 15]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 获取处理请求的app, 并作负载均衡
	 */
	exports.default = function (_ref) {
	  var appName = _ref.appName,
	      appId = _ref.appId,
	      filter = _ref.filter;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, app, onlineItems, ts, randomNumber, randomIndex;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('app');
	                _context.next = 4;
	                return db.get(appName);

	              case 4:
	                app = _context.sent;
	                onlineItems = app.list.filter(function (service) {
	                  return service.status === 1;
	                });

	                if (!(onlineItems.length === 0)) {
	                  _context.next = 8;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('TARGET_SERVICE_OFFLINE')));

	              case 8:
	                if (!appId) {
	                  _context.next = 10;
	                  break;
	                }

	                return _context.abrupt('return', resolve(onlineItems.find(function (item) {
	                  return item.appId === appId;
	                })));

	              case 10:
	                if (!(onlineItems.length === 1)) {
	                  _context.next = 12;
	                  break;
	                }

	                return _context.abrupt('return', resolve(onlineItems[0]));

	              case 12:
	                ts = String(Date.now());
	                randomNumber = Number(ts[ts.length - 1]);
	                randomIndex = Math.floor(randomNumber * onlineItems.length / 10);
	                return _context.abrupt('return', resolve(app.list[randomIndex]));

	              case 18:
	                _context.prev = 18;
	                _context.t0 = _context['catch'](0);

	                reject(_context.t0);

	              case 21:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 18]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _update = __webpack_require__(83);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * delete a app and all related sockets
	 * @param appId
	 * @param appName
	 * @returns {Promise}
	 * @constructor
	 */
	exports.default = function (_ref) {
	  var appId = _ref.appId,
	      appName = _ref.appName;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, app;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('app');
	                _context.next = 4;
	                return db.get(appName);

	              case 4:
	                app = _context.sent;

	                app.list = app.list.filter(function (item) {
	                  return item.appId !== appId;
	                });
	                _context.next = 8;
	                return dispatch((0, _update2.default)({ appName: appName, app: app }));

	              case 8:
	                resolve({});
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
	        }, _callee, undefined, [[0, 11]]);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _get = __webpack_require__(84);

	var _get2 = _interopRequireDefault(_get);

	var _update = __webpack_require__(83);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    socketId: _joi2.default.string().required(),
	    registerInfo: _joi2.default.object().required()
	  }), { allowUnknown: true });
	};

	/**
	 * 绑定app到socket /socket/add
	 * @param query.socketId
	 * @param query.registerInfo
	 * @returns {Promise}
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, db, socketId, _query$registerInfo, appName, appId, appSecret, app, targetAppIndex, targetApp, socketData;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 4;
	                  break;
	                }

	                return _context.abrupt("return", reject(validated.error));

	              case 4:
	                db = getCtx().leveldb.sub('socket');
	                socketId = query.socketId, _query$registerInfo = query.registerInfo, appName = _query$registerInfo.appName, appId = _query$registerInfo.appId, appSecret = _query$registerInfo.appSecret;
	                _context.next = 8;
	                return dispatch((0, _get2.default)({ appName: appName }));

	              case 8:
	                app = _context.sent;
	                targetAppIndex = app.list.findIndex(function (item) {
	                  return item.appId === appId && item.appSecret === appSecret;
	                });

	                if (!(targetAppIndex === -1)) {
	                  _context.next = 12;
	                  break;
	                }

	                return _context.abrupt("return", reject(new Error('ERROR_REGISTER_INFO')));

	              case 12:
	                targetApp = app.list[targetAppIndex];

	                targetApp.status = 1;
	                targetApp.socketId = socketId;
	                app.list.splice(targetAppIndex, 1, targetApp);
	                _context.next = 18;
	                return _promise2.default.all([db.put(socketId, (0, _assign2.default)({}, targetApp, { appName: appName })), dispatch((0, _update2.default)({ appName: app.appName, app: app }))]);

	              case 18:
	                socketData = (0, _assign2.default)({}, targetApp, { appName: appName });

	                resolve(socketData);
	                _context.next = 25;
	                break;

	              case 22:
	                _context.prev = 22;
	                _context.t0 = _context["catch"](0);

	                reject(_context.t0);

	              case 25:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 22]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(57);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(47);

	var _joi2 = _interopRequireDefault(_joi);

	var _session = __webpack_require__(56);

	var _session2 = _interopRequireDefault(_session);

	var _get = __webpack_require__(84);

	var _get2 = _interopRequireDefault(_get);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    socketId: _joi2.default.string(),
	    headers: _joi2.default.object().required()
	  }), { allowUnknown: true });
	};

	/**
	 * 根据socketId获取app信息
	 * @returns {Promise}
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, headers, socketId, db, session, _headers$switchIdent, appSecret, appId, appName, result, targetApp;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                validated = validate(query);

	                if (!validated.error) {
	                  _context.next = 4;
	                  break;
	                }

	                return _context.abrupt('return', reject(validated.error));

	              case 4:
	                _validated$value = validated.value, headers = _validated$value.headers, socketId = _validated$value.socketId;
	                db = getCtx().leveldb.sub('socket');
	                session = null;

	                if (!headers.hasOwnProperty('switch-identity')) {
	                  _context.next = 32;
	                  break;
	                }

	                _headers$switchIdent = headers['switch-identity'], appSecret = _headers$switchIdent.appSecret, appId = _headers$switchIdent.appId, appName = _headers$switchIdent.appName;

	                if (!(appName === 'user')) {
	                  _context.next = 20;
	                  break;
	                }

	                _context.prev = 10;
	                _context.next = 13;
	                return dispatch((0, _session2.default)({ token: appSecret }));

	              case 13:
	                session = _context.sent;
	                _context.next = 18;
	                break;

	              case 16:
	                _context.prev = 16;
	                _context.t0 = _context['catch'](10);

	              case 18:
	                _context.next = 30;
	                break;

	              case 20:
	                _context.prev = 20;
	                _context.next = 23;
	                return dispatch((0, _get2.default)({ appName: appName, appId: appId }));

	              case 23:
	                result = _context.sent;
	                targetApp = result.list.find(function (item) {
	                  return item.appId === appId && item.appSecret === appSecret;
	                });

	                if (targetApp) {
	                  session = (0, _extends3.default)({}, targetApp, { appName: appName });
	                }
	                _context.next = 30;
	                break;

	              case 28:
	                _context.prev = 28;
	                _context.t1 = _context['catch'](20);

	              case 30:
	                _context.next = 36;
	                break;

	              case 32:
	                if (!socketId) {
	                  _context.next = 36;
	                  break;
	                }

	                _context.next = 35;
	                return db.get(socketId, { valueEncoding: 'json' });

	              case 35:
	                session = _context.sent;

	              case 36:

	                resolve(session);
	                _context.next = 44;
	                break;

	              case 39:
	                _context.prev = 39;
	                _context.t2 = _context['catch'](0);

	                if (!(_context.t2.name === 'NotFoundError')) {
	                  _context.next = 43;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('SOCKET_NOT_FOUND')));

	              case 43:
	                reject(_context.t2);

	              case 44:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 39], [10, 16], [20, 28]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _list = __webpack_require__(92);

	var _list2 = _interopRequireDefault(_list);

	var _list3 = __webpack_require__(85);

	var _list4 = _interopRequireDefault(_list3);

	var _update = __webpack_require__(83);

	var _update2 = _interopRequireDefault(_update);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * empty all sockets records
	 * @returns {Promise}
	 */
	exports.default = function () {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, sockets, appList;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('socket');
	                _context.next = 4;
	                return dispatch((0, _list2.default)({ limit: null }));

	              case 4:
	                sockets = _context.sent;
	                _context.next = 7;
	                return _promise2.default.all(sockets.map(function (item) {
	                  return db.del(item._key);
	                }));

	              case 7:
	                _context.next = 9;
	                return dispatch((0, _list4.default)({ limit: null }));

	              case 9:
	                appList = _context.sent;
	                _context.next = 12;
	                return _promise2.default.all(appList.map(function (app) {
	                  app.list = app.list.map(function (item) {
	                    return (0, _assign2.default)({}, item, {
	                      socketId: "",
	                      status: 0
	                    });
	                  });
	                  return dispatch(_update2.default)({ appName: app.appName, app: app });
	                }));

	              case 12:
	                resolve();
	                _context.next = 18;
	                break;

	              case 15:
	                _context.prev = 15;
	                _context.t0 = _context['catch'](0);

	                reject(_context.t0);

	              case 18:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[0, 15]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (_ref) {
	  var _ref$limit = _ref.limit,
	      limit = _ref$limit === undefined ? 20 : _ref$limit;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, list;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                try {
	                  db = getCtx().leveldb.sub('socket');
	                  list = [];

	                  db.createReadStream({ limit: limit }).on('data', function (data) {
	                    list.push(data);
	                  }).on('end', function () {
	                    resolve({ list: list });
	                  });
	                } catch (e) {
	                  reject(e);
	                }

	              case 1:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined);
	      }));

	      return function (_x, _x2) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _get = __webpack_require__(84);

	var _get2 = _interopRequireDefault(_get);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Socket
	 * socket_${socketId}:
	 *  {
	   *   appId: 'aaa-fag-gafd123f-g123123-fda-123',
	   *   appName: 'account2',
	   *   permission: ['admin'],
	   *   socketId: 'ccc'
	   *  }
	 *
	 */

	/**
	 * get socket by appId
	 * @returns {Promise}
	 */
	exports.default = function (_ref) {
	  var appName = _ref.appName,
	      appId = _ref.appId;
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var db, app, targetAppIndex, socket;
	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.prev = 0;
	                db = getCtx().leveldb.sub('socket');
	                _context.next = 4;
	                return dispatch((0, _get2.default)({ appName: appName }));

	              case 4:
	                app = _context.sent;
	                targetAppIndex = app.list.findIndex(function (item) {
	                  return item.appId === appId;
	                });

	                if (!(targetAppIndex < 0)) {
	                  _context.next = 8;
	                  break;
	                }

	                throw new Error('APP_NOT_FOUND');

	              case 8:
	                _context.next = 10;
	                return db.get(app.list[targetAppIndex].socketId);

	              case 10:
	                socket = _context.sent;

	                resolve(socket);
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
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ }
/******/ ]);