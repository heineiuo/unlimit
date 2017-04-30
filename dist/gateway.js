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

	var _chalk = __webpack_require__(32);

	var _chalk2 = _interopRequireDefault(_chalk);

	var _actionCreator = __webpack_require__(46);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _http = __webpack_require__(57);

	var _http2 = _interopRequireDefault(_http);

	var _allActionCreators = __webpack_require__(83);

	var _allActionCreators2 = _interopRequireDefault(_allActionCreators);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var start = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
	    var config, leveldb, server, app;
	    return _regenerator2.default.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            _context4.prev = 0;
	            _context4.next = 3;
	            return (0, _config2.default)();

	          case 3:
	            config = _context4.sent;
	            _context4.next = 6;
	            return (0, _leveldb2.default)();

	          case 6:
	            leveldb = _context4.sent;
	            _context4.next = 9;
	            return (0, _http2.default)(config.https);

	          case 9:
	            server = _context4.sent;


	            // const server = require('http').createServer();
	            app = new _seashell2.default({ server: server });


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

	            server.run(app);

	            _context4.next = 21;
	            break;

	          case 17:
	            _context4.prev = 17;
	            _context4.t0 = _context4['catch'](0);

	            console.log('START FAIL\n' + _context4.t0.stack || _context4.t0);
	            process.cwd(1);

	          case 21:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, undefined, [[0, 17]]);
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.uuid = exports.pathMatch = exports.splitUrl = exports.Router = exports.App = undefined;

	var _client = __webpack_require__(7);

	Object.defineProperty(exports, 'App', {
	  enumerable: true,
	  get: function get() {
	    return _client.App;
	  }
	});
	Object.defineProperty(exports, 'Router', {
	  enumerable: true,
	  get: function get() {
	    return _client.Router;
	  }
	});
	Object.defineProperty(exports, 'splitUrl', {
	  enumerable: true,
	  get: function get() {
	    return _client.splitUrl;
	  }
	});
	Object.defineProperty(exports, 'pathMatch', {
	  enumerable: true,
	  get: function get() {
	    return _client.pathMatch;
	  }
	});
	Object.defineProperty(exports, 'uuid', {
	  enumerable: true,
	  get: function get() {
	    return _client.uuid;
	  }
	});

	var _Seashell = __webpack_require__(34);

	var _Seashell2 = _interopRequireDefault(_Seashell);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.default = _Seashell2.default;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _App = __webpack_require__(8);

	var _App2 = _interopRequireDefault(_App);

	var _Router = __webpack_require__(13);

	var _Router2 = _interopRequireDefault(_Router);

	var _tools = __webpack_require__(33);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	module.exports = {
	  App: _App2.default,
	  Router: _Router2.default,
	  splitUrl: _tools.splitUrl,
	  pathMatch: _tools.pathMatch,
	  uuid: _tools.uuid
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(9);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(10);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(11);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(12);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _Router2 = __webpack_require__(13);

	var _Router3 = _interopRequireDefault(_Router2);

	var _ws = __webpack_require__(16);

	var _ws2 = _interopRequireDefault(_ws);

	var _request = __webpack_require__(17);

	var _onRequest = __webpack_require__(24);

	var _requestSelf = __webpack_require__(28);

	var _onResponse = __webpack_require__(29);

	var _bindEventHandlers = __webpack_require__(30);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var App = function (_Router) {
	  (0, _inherits3.default)(App, _Router);

	  function App() {
	    var _ref;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, App);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = App.__proto__ || (0, _getPrototypeOf2.default)(App)).call.apply(_ref, [this].concat(args))), _this), _this.appState = 0, _this.importEmitterStack = {}, _this.request = _request.request.bind(_this), _this.onRequest = _onRequest.onRequest.bind(_this), _this.onResponse = _onResponse.onResponse.bind(_this), _this.requestSelf = _requestSelf.requestSelf.bind(_this), _this.__SEASHELL_REQUEST_TIMEOUT = 300000, _this.connect = function () {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      if (_this.appState > 0) return false;
	      console.info('[Seashell] connecting ' + opts.url);
	      _this.socket = new _ws2.default(opts.url);
	      _this.appState = 1;
	      _this.appOptions = opts;
	      _bindEventHandlers.bindEventHandlers.call(_this);
	    }, _this.disconnect = function () {
	      if (_this.appState > 0) {
	        _this.socket.close();
	      }
	      console.info('[Seashell] disconnected');
	    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }

	  /**
	   * connect to MQ hub.
	   * @param opts
	   * @returns {boolean}
	   */

	  /**
	   * disconnect with server
	   * @returns {boolean}
	   */

	  return App;
	}(_Router3.default);

	exports.default = App;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/inherits");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _classCallCheck2 = __webpack_require__(10);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _pathToRegexp = __webpack_require__(14);

	var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

	var _pathMatch = __webpack_require__(15);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var Router = function Router() {
	  var _this = this;

	  (0, _classCallCheck3.default)(this, Router);
	  this.exportActionStack = [];

	  this.use = function () {
	    var exportActionStack = _this.exportActionStack;

	    var path = void 0,
	        middleware = void 0;
	    if (arguments.length === 1) {
	      path = '*';
	      middleware = arguments.length <= 0 ? undefined : arguments[0];
	    } else {
	      path = arguments.length <= 0 ? undefined : arguments[0];
	      middleware = arguments.length <= 1 ? undefined : arguments[1];
	    }

	    var item = {
	      path: path,
	      pathRe: (0, _pathToRegexp2.default)(path),
	      pathParsed: _pathToRegexp2.default.parse(path)
	    };
	    if (middleware instanceof Function) {
	      item.fn = function () {
	        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {
	          return _regenerator2.default.wrap(function _callee$(_context) {
	            while (1) {
	              switch (_context.prev = _context.next) {
	                case 0:
	                  _context.prev = 0;
	                  _context.next = 3;
	                  return middleware(ctx, next);

	                case 3:
	                  _context.next = 8;
	                  break;

	                case 5:
	                  _context.prev = 5;
	                  _context.t0 = _context['catch'](0);

	                  ctx.emit('error', _context.t0);

	                case 8:
	                case 'end':
	                  return _context.stop();
	              }
	            }
	          }, _callee, _this, [[0, 5]]);
	        }));

	        return function (_x, _x2) {
	          return _ref.apply(this, arguments);
	        };
	      }();
	    } else {
	      item.router = middleware;
	    }
	    exportActionStack.push(item);
	  };

	  this.handleLoop = function (ctx, parentNext) {
	    var index = -1;
	    var next = function next() {
	      index++;
	      var middleware = _this.exportActionStack[index];
	      /**
	       * 如果该路由已经跑完，则进入下一个路由
	       * 否则，先判断是不是路由中间件，如果是路由中间件，则进入子路由
	       * 否则处理普通中间件，如果匹配，则执行
	       * 否则进入下一个中间件
	       */
	      if (!middleware) {
	        if (!parentNext) return ctx.emit('end');
	        return parentNext();
	      }
	      if (middleware.router) return middleware.router.handleLoop(ctx, next);
	      if (middleware.path === '*') return middleware.fn(ctx, next);
	      var params = (0, _pathMatch.pathMatch)(middleware.pathRe, ctx.request.headers.originUrl);
	      if (!params) return next();
	      (0, _assign2.default)(ctx.request.params, params);
	      return middleware.fn(ctx, next);
	    };

	    return next();
	  };
	}

	/**
	 * use
	 */

	/**
	 * @param ctx
	 * @param parentNext
	 */
	;

	exports.default = Router;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("path-to-regexp");

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var pathMatch = function pathMatch(re) {
	  var pathname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
	  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var match = re.exec(pathname);
	  var keys = re.keys;
	  if (!match) return false;

	  keys.forEach(function (key, index) {
	    var param = match[index + 1];
	    if (!param) return null;
	    params[key.name] = decodeParam(param);
	    if (key.repeat) params[key.name] = params[key.name].split(key.delimiter);
	  });

	  return params;
	};

	var decodeParam = function decodeParam(param) {
	  try {
	    return decodeURIComponent(param);
	  } catch (e) {
	    throw new Error('failed to decode param "' + param + '"');
	  }
	};

	exports.pathMatch = pathMatch;

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = require("ws");

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.request = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _typeof2 = __webpack_require__(19);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _splitUrl = __webpack_require__(20);

	var _events = __webpack_require__(21);

	var _events2 = _interopRequireDefault(_events);

	var _uuid = __webpack_require__(22);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _emitTypes = __webpack_require__(23);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * push a request to MQ hub.
	 * @param url `/${appname}/${originUrl}`
	 * @param data
	 * @param options
	 * @returns {Promise}
	 *
	 * use `socket.send` to push request
	 * push a event callback to importEmitterStack every request
	 * listening on `RESPONSE` event and return data
	 */
	/**
	 * 1. 或许创建请求的方式有问题？
	 * 请求本身应该是一个event emitter,
	 * 请求通过socket发送数据，也从socket接收到的数据中过滤自己要的数据
	 * （同时，响应也是从socket中读数据并进行处理）
	 * 创建请求时，会有一个callbackId, 通过发送带有相同callbackId的数据实现
	 * 流式发送，也实现流式读取。
	 *
	 * 2. 请求的生命周期从创建开始，中间经历发送数据和接收数据的过程，
	 * 接收数据时emit data事件，提供给需要的函数
	 *
	 * 3. 突然想到其实request和response的数据结构应该是一样的。
	 * response的context稍作修改就可以用于request。
	 *
	 * 4. 请求创建时会生成一个RequestContext, 一个Duplex Stream对象
	 */

	var request = function request(url) {
	  var _this = this;

	  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { needCallback: true };

	  if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) !== 'object') throw 'request data must be an object.';
	  var needCallback = options.needCallback || true;
	  return new _promise2.default(function (resolve, reject) {
	    try {
	      if (_this.appState !== 3) return reject("YOUR_SERVICE_IS_OFFLINE");
	      /**
	       * parse url, create req object
	       */
	      var req = {
	        body: data,
	        headers: (0, _assign2.default)((0, _extends3.default)({}, options.headers, {
	          appName: _this.appOptions.appName,
	          appId: _this.appOptions.appId
	        }), (0, _splitUrl.splitUrl)(url))
	      };

	      if (needCallback) {
	        (function () {
	          var callbackId = _uuid2.default.v4();
	          req.headers.callbackId = callbackId;
	          _this.importEmitterStack[callbackId] = new _events2.default();
	          _this.importEmitterStack[callbackId].on('RESPONSE', function (res) {
	            resolve(res);
	            delete _this.importEmitterStack[callbackId];
	            return null;
	          });
	        })();
	      } else {
	        resolve();
	      }

	      req.headers.type = 'I_HAVE_A_REQUEST';
	      _this.socket.send(clearUnsafeHeaders(req));
	    } catch (e) {
	      console.info('[Seashell] REQUEST_ERROR ' + (e.message || e));
	      reject(e);
	    }
	  });
	};

	exports.request = request;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/extends");

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/helpers/typeof");

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var splitUrl = function splitUrl(url) {
	  try {
	    var s = url.search('/');
	    if (s < 0) {
	      return {
	        importAppName: url,
	        originUrl: '/'
	      };
	    } else {
	      var sUrl = s === 0 ? url.substr(1) : url;
	      var ss = sUrl.search('/');
	      return {
	        importAppName: ss > -1 ? sUrl.substring(0, ss) : sUrl,
	        originUrl: ss > -1 ? sUrl.substring(ss) : '/'
	      };
	    }
	  } catch (e) {
	    throw e;
	  }
	};

	exports.splitUrl = splitUrl;

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("events");

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = require("uuid");

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// socket emit types

	/**
	 * service has handled request from another, transfer data back to that.
	 */
	var I_HAVE_HANDLE_THIS_REQUEST = exports.I_HAVE_HANDLE_THIS_REQUEST = 'I_HAVE_HANDLE_THIS_REQUEST';

	/**
	 * service want to request another service
	 */
	var I_HAVE_A_REQUEST = exports.I_HAVE_A_REQUEST = 'I_HAVE_A_REQUEST';

	/**
	 * handle hub's response about register
	 * if there's some error, means register has failed
	 * otherwise, it succeed
	 */
	var YOUR_REGISTER_HAS_RESPONSE = exports.YOUR_REGISTER_HAS_RESPONSE = 'YOUR_REGISTER_HAS_RESPONSE';

	/**
	 * handle response
	 * response should have `callbackId` key.
	 */
	var YOUR_REQUEST_HAS_RESPONSE = exports.YOUR_REQUEST_HAS_RESPONSE = 'YOUR_REQUEST_HAS_RESPONSE';

	/**
	 * handle request
	 */
	var PLEASE_HANDLE_THIS_REQUEST = exports.PLEASE_HANDLE_THIS_REQUEST = 'PLEASE_HANDLE_THIS_REQUEST';
	// callback emit types
	var RESPONSE = exports.RESPONSE = 'RESPONSE';
	// ctx emit types
	var end = exports.end = 'end';
	var error = exports.error = 'error';

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onRequest = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _Context = __webpack_require__(25);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * receive & handle message from hub
	 * @param req
	 */
	var onRequest = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req) {
	    var ctx;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            try {
	              console.info('[Seashell] handle request: ' + req.headers.originUrl);
	              ctx = new _Context.Context(this.socket, req);

	              this.handleLoop(ctx);
	            } catch (e) {
	              console.info('[Seashell] ' + e.message);
	            }

	          case 1:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this);
	  }));

	  return function onRequest(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

	exports.onRequest = onRequest;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Context = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _getPrototypeOf = __webpack_require__(9);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(10);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(11);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(12);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _events = __webpack_require__(21);

	var _events2 = _interopRequireDefault(_events);

	var _emitTypes = __webpack_require__(23);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var Context = function (_Emitter) {
	  (0, _inherits3.default)(Context, _Emitter);

	  function Context(socket, req) {
	    (0, _classCallCheck3.default)(this, Context);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Context.__proto__ || (0, _getPrototypeOf2.default)(Context)).call(this));

	    _this.state = {
	      isHandled: false
	    };

	    _this.socket = socket;
	    _this.request = req;
	    if (!req.hasOwnProperty('params')) _this.request.params = {};
	    _this.response = {
	      headers: req.headers,
	      body: {},
	      end: function end() {
	        if (_this.state.isHandled) throw new Error('ctx.response.end has been called!');
	        _this.state.isHandled = true;
	        socket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)({
	          headers: (0, _extends3.default)({}, _this.response.headers, { type: 'I_HAVE_HANDLE_THIS_REQUEST' }),
	          body: _this.response.body
	        }));
	        // this.emit('end');
	      }
	    };
	    return _this;
	  }

	  return Context;
	}(_events2.default);

	exports.Context = Context;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.clearUnsafeHeaders = undefined;

	var _stringify = __webpack_require__(27);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var clearUnsafeHeaders = function clearUnsafeHeaders(req) {
	  if (req instanceof Object) return (0, _stringify2.default)(req);
	  return req;
	};

	exports.clearUnsafeHeaders = clearUnsafeHeaders;

/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/json/stringify");

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.requestSelf = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _Context = __webpack_require__(25);

	var _emitTypes = __webpack_require__(23);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var requestSelf = function requestSelf(req) {
	  var _this = this;

	  var state = 0; // 0 initial 1 success 2 error

	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              try {
	                (function () {
	                  var ctx = new _Context.Context({
	                    send: function send(data) {
	                      data = JSON.parse(data);
	                      if (data.headers.type === _emitTypes.I_HAVE_HANDLE_THIS_REQUEST) {
	                        state = 1;
	                        resolve(data);
	                      } else {
	                        state = 2;
	                        reject();
	                      }
	                    }
	                  }, req);

	                  ctx.on('end', function () {
	                    process.nextTick(function () {
	                      if (!ctx.state.isHandled) {
	                        console.log('[Seashell] A no response request happened, please check ' + req.headers.originUrl + '.');
	                        ctx.response.body = { error: 'NOT_FOUND' };
	                        ctx.response.end();
	                        resolve(ctx.response);
	                      }
	                    });
	                  });

	                  _this.handleLoop(ctx);
	                })();
	              } catch (e) {
	                reject(e);
	              }

	            case 1:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.requestSelf = requestSelf;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var onResponse = function onResponse(res) {
	  var callbackId = res.headers.callbackId;

	  this.importEmitterStack[callbackId].emit('RESPONSE', res);
	};

	exports.onResponse = onResponse;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.bindEventHandlers = undefined;

	var _log = __webpack_require__(31);

	var log = _interopRequireWildcard(_log);

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}

	var bindEventHandlers = function bindEventHandlers() {
	  var _this = this;

	  this.socket.on('open', function () {
	    console.info('[Seashell] connected');
	    _this.appState = 2;
	  });

	  this.socket.on('message', function (data, flags) {
	    data = typeof data === 'string' ? JSON.parse(data) : data;
	    if (data.headers.type === 'YOUR_REGISTER_HAS_RESPONSE') {
	      console.info('[Seashell] registered');
	      _this.appState = 3;
	    } else if (data.headers.type === 'YOUR_REQUEST_HAS_RESPONSE') {
	      _this.onResponse(data, flags);
	    } else if (data.headers.type === 'PLEASE_HANDLE_THIS_REQUEST') {
	      _this.onRequest(data, flags);
	    } else {
	      console.log('Unknown message: ');
	      console.log(data);
	    }
	  });

	  this.socket.on('error', function (err) {
	    console.error(err);
	  });

	  /**
	   * listing disconnect event
	   */
	  this.socket.on('close', function () {
	    console.info('[Seashell] lost connection');
	    _this.appState = 0;
	    _this.connect(_this.appOptions);
	  });
	};

	exports.bindEventHandlers = bindEventHandlers;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.error = exports.warn = exports.info = undefined;

	var _chalk = __webpack_require__(32);

	var _chalk2 = _interopRequireDefault(_chalk);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var SeashellChalk = function SeashellChalk(color) {
	  return function (msg) {
	    var log = _chalk2.default[color].bold('[Seashell] ' + msg);
	    console.log(log);
	  };
	};

	var info = SeashellChalk('white');
	var error = SeashellChalk('red');
	var warn = SeashellChalk('yellow');

	exports.info = info;
	exports.warn = warn;
	exports.error = error;

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.uuid = exports.pathMatch = exports.splitUrl = undefined;

	var _splitUrl = __webpack_require__(20);

	Object.defineProperty(exports, 'splitUrl', {
	  enumerable: true,
	  get: function get() {
	    return _splitUrl.splitUrl;
	  }
	});

	var _pathMatch = __webpack_require__(15);

	Object.defineProperty(exports, 'pathMatch', {
	  enumerable: true,
	  get: function get() {
	    return _pathMatch.pathMatch;
	  }
	});

	var _uuid2 = __webpack_require__(22);

	var _uuid3 = _interopRequireDefault(_uuid2);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	exports.uuid = _uuid3.default;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _getPrototypeOf = __webpack_require__(9);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(10);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(11);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(12);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _isomorphicWs = __webpack_require__(35);

	var _isomorphicWs2 = _interopRequireDefault(_isomorphicWs);

	var _App2 = __webpack_require__(8);

	var _App3 = _interopRequireDefault(_App2);

	var _onChildConnection = __webpack_require__(36);

	var _onChildRequest = __webpack_require__(41);

	var _onChildResponse = __webpack_require__(42);

	var _onChildDisconnect = __webpack_require__(43);

	var _requestChild = __webpack_require__(44);

	var _requestSession = __webpack_require__(45);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * 1. 或许Seashell可以继承App, App1通过Seashell请求App2时，Seashell会作为中转用途的App去请求App2,
	 * 相当于Seashell这个App提供了两个接口，1是接收请求并转发请求，2是接收返回并转发返回
	 * 注意，Seashell在请求App2时，考虑到Seashell知道App2正在「连着自己」，所以Seashell直接给App2发请求
	 * 当Seashell发现App2不连着自己时，Seashell可以查看自己连接着的其他Seashell2，并将发送请求给Seashell2
	 *
	 * 2. Seashell维护作为App的状态，也维护作为Seashell，对App进行管理的状态。
	 *
	 * 3. 可以理解为App之间是父子关系，作为父即Seashell，可以接受子请求，转发给子，
	 * 作为子即App，处理请求，返回数据
	 *
	 */

	var Seashell = function (_App) {
	  (0, _inherits3.default)(Seashell, _App);

	  function Seashell(opts) {
	    (0, _classCallCheck3.default)(this, Seashell);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Seashell.__proto__ || (0, _getPrototypeOf2.default)(Seashell)).call(this));

	    _this.__SEASHELL_NAME = 'seashell';
	    _this.__SEASHELL_SOCKET_QUERY_URL = '/socket/query';
	    _this.__SEASHELL_SOCKET_BIND_URL = '/socket/bind';
	    _this.__SEASHELL_SOCKET_SESSION_URL = '/socket/session';
	    _this.__SEASHELL_SOCKET_UNBIND_URL = '/socket/unbind';
	    _this.__connections = {};
	    _this.onChildConnection = _onChildConnection.onChildConnection.bind(_this);
	    _this.onChildRequest = _onChildRequest.onChildRequest.bind(_this);
	    _this.onChildResponse = _onChildResponse.onChildResponse.bind(_this);
	    _this.onChildDisconnect = _onChildDisconnect.onChildDisconnect.bind(_this);
	    _this.requestChild = _requestChild.requestChild.bind(_this);
	    _this.requestSession = _requestSession.requestSession.bind(_this);

	    var options = (0, _assign2.default)({}, opts);
	    if (options.server) delete options.port;
	    _this.server = new _isomorphicWs2.default.Server(options);
	    _this.server.on('connection', _this.onChildConnection);
	    return _this;
	  }

	  return Seashell;
	}(_App3.default);

	exports.default = Seashell;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(16);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onChildConnection = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _url = __webpack_require__(37);

	var _url2 = _interopRequireDefault(_url);

	var _debug = __webpack_require__(38);

	var _register = __webpack_require__(40);

	var _uuid = __webpack_require__(22);

	var _uuid2 = _interopRequireDefault(_uuid);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * handle socket connection
	 */
	var onChildConnection = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(socket) {
	    var _this = this;

	    var url, socketData;
	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            url = _url2.default.parse(socket.upgradeReq.url, { parseQueryString: true });

	            (0, _debug.SeashellDebug)('INFO', '[new connection: ' + url.query.appName + ', ' + url.query.appId + ']');
	            socket.id = _uuid2.default.v1();
	            this.__connections[socket.id] = socket;

	            _context.prev = 4;
	            _context.next = 7;
	            return _register.register.call(this, socket, url.query);

	          case 7:
	            socketData = _context.sent;

	            (0, _debug.SeashellDebug)('INFO', url.query.appName + ' register success, id: ' + url.query.appId);
	            _context.next = 15;
	            break;

	          case 11:
	            _context.prev = 11;
	            _context.t0 = _context['catch'](4);

	            (0, _debug.SeashellDebug)('ERROR', url.query.appName + ' register failed: ' + _context.t0.message);
	            return _context.abrupt('return', socket.close());

	          case 15:

	            socket.on('message', function (data) {
	              data = JSON.parse(data);
	              if (data.headers.type === 'I_HAVE_A_REQUEST') {
	                process.nextTick(function () {
	                  return _this.onChildRequest(socket, data);
	                });
	              } else if (data.headers.type === 'I_HAVE_HANDLE_THIS_REQUEST') {
	                process.nextTick(function () {
	                  return _this.onChildResponse(socket, data);
	                });
	              }
	            });

	            /**
	             * handle disconnect
	             */
	            socket.on('close', function () {
	              delete _this.__connections[socket.id];
	              _this.onChildDisconnect(socket);
	            });

	          case 17:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[4, 11]]);
	  }));

	  return function onChildConnection(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

	exports.onChildConnection = onChildConnection;

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SeashellDebug = undefined;

	var _typeof2 = __webpack_require__(19);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _prettyjson = __webpack_require__(39);

	var _prettyjson2 = _interopRequireDefault(_prettyjson);

	var _log = __webpack_require__(31);

	var log = _interopRequireWildcard(_log);

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
	      }
	    }newObj.default = obj;return newObj;
	  }
	}

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var SeashellDebug = function SeashellDebug(type) {
	  for (var _len = arguments.length, logs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    logs[_key - 1] = arguments[_key];
	  }

	  var result = '[' + type + ']';
	  logs.forEach(function (log, index) {
	    if (index > 0) result += '\n';
	    if (typeof log === 'string') {
	      result += log;
	    } else if ((typeof log === 'undefined' ? 'undefined' : (0, _typeof3.default)(log)) === 'object') {
	      if (log.name && log.message && log.stack) {
	        result += '[ERROR]:' + '\n' + log.stack;
	      } else {
	        result += '[JSON]:' + '\n' + _prettyjson2.default.render(log);
	      }
	    }
	  });

	  type === 'ERROR' ? log.error(result) : log.info(result);
	};

	exports.SeashellDebug = SeashellDebug;

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = require("prettyjson");

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.register = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _debug = __webpack_require__(38);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	/**
	 * register app
	 * @param socket
	 * @param registerInfo
	 */
	var register = function register(socket, registerInfo) {
	  var _this = this;

	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var socketData;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;

	              if (socket.id) {
	                _context.next = 3;
	                break;
	              }

	              throw new Error('LOST_SOCKET_ID');

	            case 3:
	              _context.next = 5;
	              return _this.requestSelf({
	                headers: {
	                  originUrl: _this.__SEASHELL_SOCKET_BIND_URL,
	                  originUrlDescription: '__SEASHELL_SOCKET_BIND_URL'
	                },
	                body: {
	                  socketId: socket.id,
	                  registerInfo: registerInfo
	                }
	              });

	            case 5:
	              socketData = _context.sent;

	              if (!socketData.body.error) {
	                _context.next = 8;
	                break;
	              }

	              throw new Error(socketData.body.error);

	            case 8:
	              socket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)({
	                headers: { type: 'YOUR_REGISTER_HAS_RESPONSE' },
	                body: { success: 1, socketData: socketData.body }
	              }));
	              resolve(socketData.body);
	              _context.next = 16;
	              break;

	            case 12:
	              _context.prev = 12;
	              _context.t0 = _context['catch'](0);

	              try {
	                socket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)({
	                  headers: { type: 'YOUR_REGISTER_HAS_RESPONSE' },
	                  body: { error: _context.t0.message }
	                }));
	              } catch (e) {
	                console.log(e);
	              }
	              reject(_context.t0);

	            case 16:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this, [[0, 12]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.register = register;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onChildRequest = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _debug = __webpack_require__(38);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var onChildRequest = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(socket, req) {
	    var _req$headers, importAppName, originUrl, __SEASHELL_START, appName, appId, isToSelf, result, findResponseService, targetSocket;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _req$headers = req.headers, importAppName = _req$headers.importAppName, originUrl = _req$headers.originUrl, __SEASHELL_START = _req$headers.__SEASHELL_START, appName = _req$headers.appName, appId = _req$headers.appId;

	            req.headers.__SEASHELL_START = Date.now();
	            isToSelf = importAppName === this.__SEASHELL_NAME;
	            _context.prev = 3;
	            _context.next = 6;
	            return this.requestSession(req, socket);

	          case 6:
	            req.headers.session = _context.sent;

	            if (!isToSelf) {
	              _context.next = 15;
	              break;
	            }

	            _context.next = 10;
	            return this.requestSelf(req);

	          case 10:
	            result = _context.sent;

	            result.headers.type = 'YOUR_REQUEST_HAS_RESPONSE';
	            socket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)(result));
	            _context.next = 23;
	            break;

	          case 15:
	            _context.next = 17;
	            return this.requestSelf({
	              headers: {
	                originUrl: this.__SEASHELL_SOCKET_QUERY_URL,
	                originUrlDescription: '__SEASHELL_SOCKET_QUERY_URL'
	              },
	              body: {
	                appName: importAppName,
	                appId: appId
	              }
	            });

	          case 17:
	            findResponseService = _context.sent;
	            targetSocket = this.__connections[findResponseService.body.socketId];

	            if (targetSocket) {
	              _context.next = 21;
	              break;
	            }

	            throw new Error(findResponseService.body.error || 'TARGET_SERVICE_OFFLINE');

	          case 21:

	            req.headers.type = 'PLEASE_HANDLE_THIS_REQUEST';
	            targetSocket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)(req));

	          case 23:
	            _context.next = 32;
	            break;

	          case 25:
	            _context.prev = 25;
	            _context.t0 = _context['catch'](3);

	            req.headers.status = 'ERROR';
	            req.body.error = _context.t0.message;
	            req.headers.type = 'YOUR_REQUEST_HAS_RESPONSE';
	            socket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)(req));

	            (0, _debug.SeashellDebug)('ERROR', '[' + appName + '] --> [' + importAppName + originUrl + ']' + ('[ERROR][' + _context.t0.message + '][' + (Date.now() - __SEASHELL_START) + 'ms]'));

	          case 32:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[3, 25]]);
	  }));

	  return function onChildRequest(_x, _x2) {
	    return _ref.apply(this, arguments);
	  };
	}();

	exports.onChildRequest = onChildRequest;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onChildResponse = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _debug = __webpack_require__(38);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var onChildResponse = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(socket, res) {
	    var _res$headers, appName, appId, callbackId, callbackAppId, importAppName, originUrl, __SEASHELL_START, findRequestApp, requestSocket;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _res$headers = res.headers, appName = _res$headers.appName, appId = _res$headers.appId, callbackId = _res$headers.callbackId, callbackAppId = _res$headers.callbackAppId, importAppName = _res$headers.importAppName, originUrl = _res$headers.originUrl, __SEASHELL_START = _res$headers.__SEASHELL_START;

	            /**
	             * 如果没有callbackId, drop这个处理（用于send请求，仅发送消息）
	             * 如果请求来自requestChild, 触发callback emit
	             * 否则如果没有appId或appName, 该响应非法
	             * 否则根据appName和appId找到socket，
	             * 存在不在线的情况，需要做丢弃或者离线处理（离线处理涉及到callbackId的存储问题）
	             */

	            if (callbackId) {
	              _context.next = 3;
	              break;
	            }

	            return _context.abrupt('return', null);

	          case 3:
	            _context.prev = 3;

	            if (!(res.headers.appName === this.__SEASHELL_NAME)) {
	              _context.next = 7;
	              break;
	            }

	            try {
	              this.importEmitterStack[callbackId].emit('RESPONSE', res);
	            } catch (e) {}
	            return _context.abrupt('return', null);

	          case 7:
	            if (!(!appId || !appName)) {
	              _context.next = 9;
	              break;
	            }

	            return _context.abrupt('return', null);

	          case 9:
	            _context.next = 11;
	            return this.requestSelf({ headers: {
	                originUrl: this.__SEASHELL_SOCKET_QUERY_URL,
	                originUrlDescription: '__SEASHELL_SOCKET_QUERY_URL'
	              }, body: {
	                appId: callbackAppId ? callbackAppId : appId,
	                appName: appName
	              } });

	          case 11:
	            findRequestApp = _context.sent;
	            requestSocket = this.__connections[findRequestApp.body.socketId] || null;

	            if (requestSocket) {
	              _context.next = 15;
	              break;
	            }

	            return _context.abrupt('return', (0, _debug.SeashellDebug)('WARN', 'the request app offline, maybe resent response later...'));

	          case 15:

	            res.headers.type = 'YOUR_REQUEST_HAS_RESPONSE';
	            requestSocket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)(res));
	            (0, _debug.SeashellDebug)('INFO', '[' + requestSocket.appName + '] --> [' + importAppName + originUrl + ']' + ('[DONE][' + (Date.now() - __SEASHELL_START) + 'ms]'));

	            _context.next = 23;
	            break;

	          case 20:
	            _context.prev = 20;
	            _context.t0 = _context['catch'](3);

	            (0, _debug.SeashellDebug)('ERROR', _context.t0);

	          case 23:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, this, [[3, 20]]);
	  }));

	  return function onChildResponse(_x, _x2) {
	    return _ref.apply(this, arguments);
	  };
	}();

	exports.onChildResponse = onChildResponse;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onChildDisconnect = undefined;

	var _debug = __webpack_require__(38);

	var onChildDisconnect = function onChildDisconnect(socket) {
	  var _this = this;

	  var deleteSocket = function deleteSocket(socketId) {
	    var retry = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	    try {
	      (0, _debug.SeashellDebug)('INFO', socketId + ' disconnected');
	      _this.requestSelf({
	        headers: {
	          originUrl: _this.__SEASHELL_SOCKET_UNBIND_URL,
	          originUrlDescription: '__SEASHELL_SOCKET_UNBIND_URL'
	        },
	        body: { socketId: socketId }
	      });
	    } catch (e) {
	      if (retry < 3) {
	        retry++;
	        deleteSocket(socketId, retry);
	      }
	    }
	  };
	  deleteSocket(socket.id);
	};

	exports.onChildDisconnect = onChildDisconnect;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.requestChild = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _assign = __webpack_require__(4);

	var _assign2 = _interopRequireDefault(_assign);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _uuid = __webpack_require__(22);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _debug = __webpack_require__(38);

	var _splitUrl2 = __webpack_require__(20);

	var _events = __webpack_require__(21);

	var _events2 = _interopRequireDefault(_events);

	var _clearUnsafeHeaders = __webpack_require__(26);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var requestChild = function () {
	  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(url) {
	    var _this = this;

	    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { needCallback: true };

	    var _splitUrl, importAppName, originUrl, needCallback, req;

	    return _regenerator2.default.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            _splitUrl = (0, _splitUrl2.splitUrl)(url), importAppName = _splitUrl.importAppName, originUrl = _splitUrl.originUrl;
	            needCallback = options.needCallback || true;
	            req = {
	              body: data,
	              headers: (0, _assign2.default)((0, _extends3.default)({}, options.headers, {
	                appName: this.__SEASHELL_NAME,
	                appId: 'SEASHELL',
	                __SEASHELL_START: Date.now()
	              }), {
	                importAppName: importAppName, originUrl: originUrl
	              })
	            };
	            return _context2.abrupt('return', new _promise2.default(function () {
	              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	                var res, findResponseService, targetSocket;
	                return _regenerator2.default.wrap(function _callee$(_context) {
	                  while (1) {
	                    switch (_context.prev = _context.next) {
	                      case 0:
	                        _context.prev = 0;
	                        _context.next = 3;
	                        return _this.requestSession(req);

	                      case 3:
	                        req.headers.session = _context.sent;

	                        if (!(importAppName === _this.__SEASHELL_NAME)) {
	                          _context.next = 9;
	                          break;
	                        }

	                        _context.next = 7;
	                        return _this.requestSelf(req);

	                      case 7:
	                        res = _context.sent;
	                        return _context.abrupt('return', resolve(res));

	                      case 9:
	                        _context.next = 11;
	                        return _this.requestSelf({
	                          headers: {
	                            session: req.headers.session,
	                            originUrl: _this.__SEASHELL_SOCKET_QUERY_URL
	                          },
	                          body: {
	                            appName: importAppName
	                          }
	                        });

	                      case 11:
	                        findResponseService = _context.sent;
	                        targetSocket = _this.__connections[findResponseService.body.socketId];

	                        if (targetSocket) {
	                          _context.next = 15;
	                          break;
	                        }

	                        throw new Error(findResponseService.body.error || 'TARGET_SERVICE_OFFLINE');

	                      case 15:

	                        if (needCallback) {
	                          (function () {
	                            var callbackId = req.headers.callbackId = _uuid2.default.v4();
	                            var callback = function callback(res) {
	                              delete _this.importEmitterStack[callbackId];
	                              resolve(res);
	                              (0, _debug.SeashellDebug)('INFO', '[' + _this.__SEASHELL_NAME + '] --> [' + importAppName + originUrl + ']' + ('[DONE][' + (Date.now() - req.headers.__SEASHELL_START) + 'ms]'));
	                              return null;
	                            };
	                            _this.importEmitterStack[callbackId] = new _events2.default();
	                            _this.importEmitterStack[callbackId].on('RESPONSE', callback);
	                            setTimeout(function () {
	                              try {
	                                _this.importEmitterStack[callbackId].off('RESPONSE', callback);
	                                delete _this.importEmitterStack[callbackId];
	                              } catch (e) {}
	                              return null;
	                            }, _this.__SEASHELL_REQUEST_TIMEOUT);
	                          })();
	                        } else {
	                          resolve();
	                        }

	                        req.headers.type = 'PLEASE_HANDLE_THIS_REQUEST';
	                        targetSocket.send((0, _clearUnsafeHeaders.clearUnsafeHeaders)(req));

	                        _context.next = 26;
	                        break;

	                      case 20:
	                        _context.prev = 20;
	                        _context.t0 = _context['catch'](0);

	                        req.headers.status = 'ERROR';
	                        req.body.error = _context.t0.message;

	                        (0, _debug.SeashellDebug)('ERROR', '[' + _this.__SEASHELL_NAME + '] --> [' + importAppName + originUrl + ']' + ('[ERROR][' + _context.t0.message + '][' + (Date.now() - req.headers.__SEASHELL_START) + 'ms]'));

	                        resolve(req);

	                      case 26:
	                      case 'end':
	                        return _context.stop();
	                    }
	                  }
	                }, _callee, _this, [[0, 20]]);
	              }));

	              return function (_x4, _x5) {
	                return _ref2.apply(this, arguments);
	              };
	            }()));

	          case 4:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this);
	  }));

	  return function requestChild(_x) {
	    return _ref.apply(this, arguments);
	  };
	}();

	exports.requestChild = requestChild;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.requestSession = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var requestSession = function requestSession(req) {
	  var _this = this;

	  var socket = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      var _requestSession;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return _this.requestSelf({
	                headers: {
	                  originUrl: _this.__SEASHELL_SOCKET_SESSION_URL,
	                  originUrlDescription: '__SEASHELL_SOCKET_SESSION_URL'
	                },
	                body: {
	                  headers: req.headers,
	                  socketId: socket.id
	                }
	              });

	            case 3:
	              _requestSession = _context.sent;

	              if (!_requestSession.body.error) {
	                _context.next = 6;
	                break;
	              }

	              return _context.abrupt('return', resolve(null));

	            case 6:
	              resolve(_requestSession.body);
	              _context.next = 12;
	              break;

	            case 9:
	              _context.prev = 9;
	              _context.t0 = _context['catch'](0);

	              resolve(null);

	            case 12:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, _this, [[0, 9]]);
	    }));

	    return function (_x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

	exports.requestSession = requestSession;

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = require("action-creator");

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _os = __webpack_require__(48);

	var _yargs = __webpack_require__(49);

	var _fsPromise = __webpack_require__(50);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	var _json = __webpack_require__(51);

	var _json2 = _interopRequireDefault(_json);

	var _path = __webpack_require__(52);

	var _path2 = _interopRequireDefault(_path);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var config = {};
	var configReady = false;
	var configError = null;

	exports.default = function () {
	  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var name, datadir, conf, confContent;
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
	              _context.prev = 4;
	              name = 'seashell-gateway';
	              datadir = _yargs.argv.datadir ? _yargs.argv.datadir : (0, _os.homedir)() + "/data/" + name;
	              conf = _yargs.argv.conf ? _yargs.argv.conf : (0, _os.homedir)() + "/data/" + name + "/config.json";
	              _context.t0 = _json2.default;
	              _context.next = 11;
	              return _fsPromise2.default.readFile(conf, 'utf8');

	            case 11:
	              _context.t1 = _context.sent;
	              confContent = _context.t0.parse.call(_context.t0, _context.t1);

	              delete confContent.conf;
	              config = (0, _extends3.default)({ datadir: datadir }, confContent, _yargs.argv);
	              configReady = true;
	              resolve(config);
	              _context.next = 23;
	              break;

	            case 19:
	              _context.prev = 19;
	              _context.t2 = _context["catch"](4);

	              configError = _context.t2;
	              reject(configError);

	            case 23:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[4, 19]]);
	    }));

	    return function (_x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = require("os");

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = require("yargs");

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = require("fs-promise");

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = require("json5");

/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 53 */
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

	var _levelup = __webpack_require__(54);

	var _levelup2 = _interopRequireDefault(_levelup);

	var _levelSublevel = __webpack_require__(55);

	var _levelSublevel2 = _interopRequireDefault(_levelSublevel);

	var _qLevel = __webpack_require__(56);

	var _qLevel2 = _interopRequireDefault(_qLevel);

	var _config = __webpack_require__(47);

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
/* 54 */
/***/ function(module, exports) {

	module.exports = require("levelup");

/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = require("level-sublevel");

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = require("q-level");

/***/ },
/* 57 */
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

	var _morgan = __webpack_require__(58);

	var _morgan2 = _interopRequireDefault(_morgan);

	var _compression = __webpack_require__(59);

	var _compression2 = _interopRequireDefault(_compression);

	var _express = __webpack_require__(60);

	var _express2 = _interopRequireDefault(_express);

	var _os = __webpack_require__(48);

	var _http = __webpack_require__(61);

	var _http2 = _interopRequireDefault(_http);

	var _https = __webpack_require__(62);

	var _https2 = _interopRequireDefault(_https);

	var _pickLocation = __webpack_require__(63);

	var _pickLocation2 = _interopRequireDefault(_pickLocation);

	var _execLocation = __webpack_require__(65);

	var _execLocation2 = _interopRequireDefault(_execLocation);

	var _proxySeashell = __webpack_require__(77);

	var _proxySeashell2 = _interopRequireDefault(_proxySeashell);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _SNICallback = __webpack_require__(80);

	var _SNICallback2 = _interopRequireDefault(_SNICallback);

	var _letiny = __webpack_require__(82);

	var _letiny2 = _interopRequireDefault(_letiny);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var seashell = null; /**
	                      * This is an example integration, you should not use it directly in production.
	                      *
	                      * This integration shows how to proxy a http request to seashell,
	                      * this means you can write http api by seashell technology, then the only thing you
	                      * need do is the proxy.
	                      * This integration also show how to control an http service(like stop or restart), from seashell
	                      */

	var getSeashell = function getSeashell() {
	  return new _promise2.default(function (resolve, reject) {
	    if (seashell) return resolve(seashell);
	    rereject(new Error('Seashell not ready'));
	  });
	};

	var app = (0, _express2.default)();

	app.use((0, _morgan2.default)('[SEASHELL][:req[host]:url][:status][:response-time ms]', {}));
	app.use((0, _compression2.default)());

	app.use(_letiny2.default.webrootChallengeMiddleware((0, _os.tmpdir)()));

	/**
	 * 1. 先获取location， 并处理http-https跳转
	 * 2. 如果location.type是seashell，则先请求seashell，
	 *  如果seashell请求结果是直接返回结果，则直接返回，不经过execLocation，
	 *  否则更新res.locals.location， 并交给execLocation继续处理
	 * 3. execLocation能处理各种http请求响应情况，比如html，json，下载文件，上传文件等。
	 */
	app.use((0, _pickLocation2.default)(getSeashell));
	app.use((0, _proxySeashell2.default)(getSeashell));
	app.use((0, _execLocation2.default)(getSeashell));

	app.use(function (err, req, res, next) {
	  if (!err) return next();
	  /**
	   * 即没有找到host，返回404
	   */
	  if (err.message === 'HOST_NOT_FOUND') return next();
	  /**
	   * 即没有找到location，404
	   */
	  if (err.message === 'LOCATION_NOT_FOUND') return res.end(req.headers.host + ": \n LOCATION NOT FOUND");
	  /**
	   * 用户非法请求
	   */
	  if (err.message === 'UNDEFINED_TYPE') return res.end(req.headers.host + ": \n CONFIGURE ERROR");
	  if (err.message === 'NOT_FOUND') return next();
	  console.log('Catch Error: \n' + err.stack || err);
	  return res.json({ error: err.message });
	});

	app.use(function (req, res) {
	  res.status(404);
	  res.end('NOT FOUND \n SEASHELL SERVER.');
	});

	/**
	 * @param seashell
	 * @param server
	 * @param [secureServer]
	 */
	var run = function run(s, server, secureServer) {
	  seashell = s;
	  server.listen(80, function () {
	    return console.log('http on port 80');
	  });
	  if (secureServer) secureServer.listen(443, function () {
	    return console.log('http on port 443');
	  });
	};

	exports.default = function () {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	      var server, secureServer, config, enableHttps;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              server = _http2.default.createServer(app);
	              secureServer = null;
	              _context.prev = 2;
	              _context.next = 5;
	              return (0, _config2.default)();

	            case 5:
	              config = _context.sent;
	              enableHttps = config.https.enable || false;

	              if (enableHttps) {
	                _context.next = 10;
	                break;
	              }

	              server.run = function (s) {
	                return run(s, server);
	              };
	              return _context.abrupt("return", resolve(server));

	            case 10:

	              secureServer = _https2.default.createServer({ SNICallback: _SNICallback2.default }, app);
	              secureServer.run = function (s) {
	                return run(s, server, secureServer);
	              };
	              return _context.abrupt("return", resolve(secureServer));

	            case 15:
	              _context.prev = 15;
	              _context.t0 = _context["catch"](2);

	              reject(_context.t0);

	            case 18:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[2, 15]]);
	    }));

	    return function (_x, _x2) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = require("https");

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.findTargetLocation = exports.pickLocation = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _url = __webpack_require__(37);

	var _url2 = _interopRequireDefault(_url);

	var _uaParserJs = __webpack_require__(64);

	var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

	var _pathToRegexp = __webpack_require__(14);

	var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 通过比对pathname, 找到路由
	 */
	var pickLocation = exports.pickLocation = function pickLocation(locations, requrl) {
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

	var findTargetLocation = exports.findTargetLocation = function findTargetLocation(locations, url) {
	  return locations.find(function (item) {
	    var re = (0, _pathToRegexp2.default)(item.pathname);
	    var matches = url.pathname.match(re);
	    return matches && matches[0] === url.pathname;
	  });
	};

	/**e
	 * 查找host及其location列表
	 */

	exports.default = function (getSeashell) {
	  return function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var seashell, host, forceHTTPSDomains, requestLocations, _requestLocations$bod, locations, driveId, _ref2, location, url, browser;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return getSeashell();

	            case 3:
	              seashell = _context.sent;
	              host = req.headers.host;
	              _context.next = 7;
	              return (0, _config2.default)();

	            case 7:
	              forceHTTPSDomains = _context.sent.https.forceHTTPSDomains;
	              _context.next = 10;
	              return seashell.requestSelf({
	                headers: { originUrl: '/drive/queryOneByDomain' },
	                body: { domain: host, fields: ['locations'] }
	              });

	            case 10:
	              requestLocations = _context.sent;

	              if (!requestLocations.body.error) {
	                _context.next = 13;
	                break;
	              }

	              return _context.abrupt("return", next(new Error(requestLocations.body.error)));

	            case 13:
	              _requestLocations$bod = requestLocations.body, locations = _requestLocations$bod.locations, driveId = _requestLocations$bod.driveId;
	              _context.next = 16;
	              return pickLocation(locations, req.url);

	            case 16:
	              _ref2 = _context.sent;
	              location = _ref2.location;
	              url = _ref2.url;


	              res.locals.host = host;
	              res.locals.driveId = driveId.toString();
	              res.locals.url = url;
	              res.locals.location = location;

	              if (!location.cors) {
	                _context.next = 31;
	                break;
	              }

	              res.set('Access-Control-Expose-Headers', '*');
	              // IE8 does not allow domains to be specified, just the *
	              // headers["Access-Control-Allow-Origin"] = req.headers.origin;
	              res.set('Access-Control-Allow-Origin', '*');
	              res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, X-Requested-With');
	              res.set('Access-Control-Allow-Methods', '*');

	              if (!(req.method === 'OPTIONS')) {
	                _context.next = 31;
	                break;
	              }

	              res.set("Access-Control-Max-Age", '86400');
	              return _context.abrupt("return", res.end());

	            case 31:

	              if (location['X-Frame-Options']) {
	                res.set('X-Frame-Options', location['X-Frame-Options']);
	              }

	              res.removeHeader("x-powered-by");

	              if (!(forceHTTPSDomains.indexOf(req.headers.host) > -1)) {
	                _context.next = 38;
	                break;
	              }

	              if (!(req.protocol === 'http')) {
	                _context.next = 38;
	                break;
	              }

	              browser = new _uaParserJs2.default().setUA(req.headers['user-agent']).getBrowser();

	              if (!(browser.name !== 'IE' || browser.name === 'IE' && Number(browser.major) >= 9)) {
	                _context.next = 38;
	                break;
	              }

	              return _context.abrupt("return", res.redirect("https://" + req.headers.host + req.originalUrl));

	            case 38:

	              next();

	              _context.next = 44;
	              break;

	            case 41:
	              _context.prev = 41;
	              _context.t0 = _context["catch"](0);

	              next(_context.t0);

	            case 44:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 41]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }();
	};

/***/ },
/* 64 */
/***/ function(module, exports) {

	module.exports = require("ua-parser-js");

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _html = __webpack_require__(66);

	var _html2 = _interopRequireDefault(_html);

	var _block = __webpack_require__(68);

	var _block2 = _interopRequireDefault(_block);

	var _file = __webpack_require__(69);

	var _file2 = _interopRequireDefault(_file);

	var _redirect = __webpack_require__(70);

	var _redirect2 = _interopRequireDefault(_redirect);

	var _download = __webpack_require__(71);

	var _download2 = _interopRequireDefault(_download);

	var _upload = __webpack_require__(72);

	var _upload2 = _interopRequireDefault(_upload);

	var _proxyHTTP = __webpack_require__(74);

	var _proxyHTTP2 = _interopRequireDefault(_proxyHTTP);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (getSeashell) {
	  return function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
	      var seashell, _res$locals, location, _res$locals$location, type, content, url, driveId, handles;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return getSeashell();

	            case 3:
	              seashell = _context.sent;
	              _res$locals = res.locals, location = _res$locals.location, _res$locals$location = _res$locals.location, type = _res$locals$location.type, content = _res$locals$location.content, url = _res$locals.url, driveId = _res$locals.driveId;
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

	              /**
	               * 未定义的type类型, 报非法请求错误
	               */

	              if (handles.hasOwnProperty(type)) {
	                _context.next = 8;
	                break;
	              }

	              return _context.abrupt("return", next(new Error('ILLEGAL_HTTP_REQUEST')));

	            case 8:
	              _context.next = 10;
	              return handles[type]();

	            case 10:
	              _context.next = 17;
	              break;

	            case 12:
	              _context.prev = 12;
	              _context.t0 = _context["catch"](0);

	              if (!(_context.t0.message === 'USE_PROXY')) {
	                _context.next = 16;
	                break;
	              }

	              return _context.abrupt("return", (0, _proxyHTTP2.default)(req, res, next));

	            case 16:
	              next(_context.t0);

	            case 17:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 12]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }();
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _ent = __webpack_require__(67);

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
/* 67 */
/***/ function(module, exports) {

	module.exports = require("ent");

/***/ },
/* 68 */
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
/* 69 */
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
	              _context.next = 24;
	              break;

	            case 21:
	              _context.prev = 21;
	              _context.t1 = _context['catch'](10);

	              reject(_context.t1);

	            case 24:
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
/* 70 */
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
/* 71 */
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
/* 72 */
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

	var _formidable = __webpack_require__(73);

	var _formidable2 = _interopRequireDefault(_formidable);

	var _path = __webpack_require__(52);

	var _path2 = _interopRequireDefault(_path);

	var _fsPromise = __webpack_require__(50);

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
	              _context2.next = 19;
	              break;

	            case 16:
	              _context2.prev = 16;
	              _context2.t0 = _context2["catch"](0);

	              reject(_context2.t0);

	            case 19:
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
/* 73 */
/***/ function(module, exports) {

	module.exports = require("formidable");

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(75);

	var _keys2 = _interopRequireDefault(_keys);

	var _httpProxy = __webpack_require__(76);

	var _httpProxy2 = _interopRequireDefault(_httpProxy);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 反向代理
	 */

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

	exports.default = function (req, res, next) {
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

/***/ },
/* 75 */
/***/ function(module, exports) {

	module.exports = require("babel-runtime/core-js/object/keys");

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = require("http-proxy");

/***/ },
/* 77 */
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

	var _express = __webpack_require__(60);

	var _bodyParser = __webpack_require__(78);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _pick = __webpack_require__(79);

	var _pick2 = _interopRequireDefault(_pick);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (getSeashell) {

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
	      var seashell, _res$locals, host, url, location, __GATEWAY_META, data, content, requestUrl, result, originUrl, session;

	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return getSeashell();

	            case 3:
	              seashell = _context.sent;
	              _res$locals = res.locals, host = _res$locals.host, url = _res$locals.url, location = _res$locals.location;
	              __GATEWAY_META = (0, _assign2.default)({}, (0, _pick2.default)(req, ['ip', 'method', 'originalUrl', 'protocol']), (0, _pick2.default)(req.headers, ['user-agent', 'host']));
	              data = (0, _assign2.default)({}, req.query, req.body);
	              content = location.content;
	              requestUrl = url.pathname.substring(content.length);
	              result = { body: {} };

	              if (!(requestUrl.search(seashell.__SEASHELL_NAME) === 0)) {
	                _context.next = 27;
	                break;
	              }

	              originUrl = requestUrl.substring(seashell.__SEASHELL_NAME.length);
	              session = null;
	              _context.prev = 13;
	              _context.next = 16;
	              return seashell.requestSession({
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  'switch-identity': {
	                    appName: 'user',
	                    appSecret: data.token
	                  }
	                }
	              });

	            case 16:
	              session = _context.sent;
	              _context.next = 21;
	              break;

	            case 19:
	              _context.prev = 19;
	              _context.t0 = _context["catch"](13);

	            case 21:

	              delete data.token;

	              _context.next = 24;
	              return seashell.requestSelf({
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  originUrl: originUrl,
	                  session: session
	                },
	                body: data
	              });

	            case 24:
	              result = _context.sent;
	              _context.next = 30;
	              break;

	            case 27:
	              _context.next = 29;
	              return seashell.requestChild(requestUrl, data, {
	                headers: {
	                  __GATEWAY_META: __GATEWAY_META,
	                  'switch-identity': {
	                    appName: 'user',
	                    appSecret: data.token
	                  }
	                }
	              });

	            case 29:
	              result = _context.sent;

	            case 30:

	              if (result.body.error === 'TARGET_SERVICE_OFFLINE') res.status(404);

	              if (result.headers.hasOwnProperty('__HTML')) {
	                (0, _assign2.default)(res.locals.location, { type: 'HTML', content: result.body.html });
	              } else if (result.headers.hasOwnProperty('__UPLOAD')) {
	                (0, _assign2.default)(res.locals.location, { type: 'UPLOAD', content: result.body });
	              } else {
	                (0, _assign2.default)(res.locals.location, { type: 'JSON', content: result.body });
	              }

	              next();
	              _context.next = 38;
	              break;

	            case 35:
	              _context.prev = 35;
	              _context.t1 = _context["catch"](0);

	              next(_context.t1);

	            case 38:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 35], [13, 19]]);
	    }));

	    return function (_x, _x2, _x3) {
	      return _ref.apply(this, arguments);
	    };
	  }());

	  router.use(function (err, req, res, next) {
	    if (!err || err.message === 'NOT_SEASHELL') return next();
	    next(err);
	  });

	  return router;
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = require("lodash/pick");

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

	var _fsPromise = __webpack_require__(50);

	var _fsPromise2 = _interopRequireDefault(_fsPromise);

	var _path = __webpack_require__(52);

	var _path2 = _interopRequireDefault(_path);

	var _tls = __webpack_require__(81);

	var _tls2 = _interopRequireDefault(_tls);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ctxMap = {};

	exports.default = function (servername, callback) {
	  process.nextTick((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
	    var _ref2, approvedDomains, datadir, pemdir, ctx;

	    return _regenerator2.default.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            _context.next = 3;
	            return (0, _config2.default)();

	          case 3:
	            _ref2 = _context.sent;
	            approvedDomains = _ref2.https.approvedDomains;
	            datadir = _ref2.datadir;
	            pemdir = datadir + '/pem';

	            console.log('servername: ' + servername);
	            console.log('pemdir: ' + pemdir);

	            if (!ctxMap[servername]) {
	              _context.next = 11;
	              break;
	            }

	            return _context.abrupt('return', callback(null, ctxMap[servername]));

	          case 11:
	            console.log('is approved: ' + approvedDomains.includes(servername));

	            if (approvedDomains.includes(servername)) {
	              _context.next = 14;
	              break;
	            }

	            return _context.abrupt('return', callback(new Error('Unapproved domain')));

	          case 14:
	            console.log('start create secure context..');
	            _context.t0 = _tls2.default;
	            _context.next = 18;
	            return _fsPromise2.default.readFileSync(pemdir + '/' + servername + '/ca.pem');

	          case 18:
	            _context.t1 = _context.sent;
	            _context.next = 21;
	            return _fsPromise2.default.readFileSync(pemdir + '/' + servername + '/key.pem');

	          case 21:
	            _context.t2 = _context.sent;
	            _context.next = 24;
	            return _fsPromise2.default.readFileSync(pemdir + '/' + servername + '/cert.pem');

	          case 24:
	            _context.t3 = _context.sent;
	            _context.t4 = {
	              ca: _context.t1,
	              key: _context.t2,
	              cert: _context.t3
	            };
	            ctx = ctxMap[servername] = _context.t0.createSecureContext.call(_context.t0, _context.t4);

	            console.log(ctx);
	            callback(null, ctx);
	            _context.next = 35;
	            break;

	          case 31:
	            _context.prev = 31;
	            _context.t5 = _context['catch'](0);

	            console.log(_context.t5);
	            callback(_context.t5);

	          case 35:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 31]]);
	  })));
	};

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = require("tls");

/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = require("letiny");

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  account: {
	    mutateCreateVerificationCode: __webpack_require__(84).default,
	    mutateCreateAuthCode: __webpack_require__(87).default,
	    mutateCreateToken: __webpack_require__(91).default,
	    mutateDeleteToken: __webpack_require__(95).default,
	    session: __webpack_require__(96).default,
	    queryOne: __webpack_require__(92).default,
	    queryAll: __webpack_require__(99).default
	  },
	  fs: {
	    queryFileContent: __webpack_require__(100).default,
	    queryOneByFullPath: __webpack_require__(101).default,
	    queryOneById: __webpack_require__(102).default,
	    queryFile: __webpack_require__(103).default,
	    mutateInsertOne: __webpack_require__(104).default,
	    mutateUpload: __webpack_require__(105).default,
	    mutateDelete: __webpack_require__(106).default,
	    mutateFileContent: __webpack_require__(107).default
	  },
	  drive: {
	    queryOne: __webpack_require__(108).default,
	    queryMeta: __webpack_require__(109).default,
	    queryUsers: __webpack_require__(110).default,
	    queryOneByDomain: __webpack_require__(111).default,
	    queryPermission: __webpack_require__(112).default,
	    mutateCreate: __webpack_require__(113).default,
	    mutateDisableDrive: __webpack_require__(114).default,
	    mutateDomain: __webpack_require__(115).default,
	    mutateInsertOne: __webpack_require__(113).default,
	    mutateLocation: __webpack_require__(116).default,
	    mutateUser: __webpack_require__(117).default,
	    mutateApproveDomain: __webpack_require__(119).default
	  },
	  app: {
	    querySession: __webpack_require__(121).default,
	    mutateInsertOne: __webpack_require__(122).default,
	    remove: __webpack_require__(123).default,
	    queryApp: __webpack_require__(126).default,
	    mutateCreateToken: __webpack_require__(127).default,
	    find: __webpack_require__(98).default,
	    removeItem: __webpack_require__(128).default
	  },
	  client: {
	    query: __webpack_require__(130).default
	  },
	  socket: {
	    query: __webpack_require__(131).default,
	    bind: __webpack_require__(132).default,
	    unbind: __webpack_require__(124).default,
	    session: __webpack_require__(133).default
	  }
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = exports.createNumberCode = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _aliPush = __webpack_require__(85);

	var _aliPush2 = _interopRequireDefault(_aliPush);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

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

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    email: _joi2.default.string().required()
	  }), { allowUnknown: true });
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
	                validated = validate(query);

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
	                _context.next = 10;
	                return (0, _leveldb2.default)();

	              case 10:
	                db = _context.sent.sub('emailcode');
	                code = createNumberCode();
	                _context.next = 14;
	                return db.put(email, { code: code, createTime: Date.now() });

	              case 14:
	                console.log({ email: email, code: code });

	                options = {
	                  ToAddress: email,
	                  Subject: '验证码',
	                  FromAlias: '右括号',
	                  TextBody: '\u60A8\u7684\u9A8C\u8BC1\u7801\u4E3A' + code
	                };

	                if (!config.debug) {
	                  _context.next = 18;
	                  break;
	                }

	                return _context.abrupt('return', resolve({ email: email }));

	              case 18:

	                if (!client) {
	                  client = new _aliPush2.default({
	                    AccessKeyId: config.aliyun.accessid,
	                    AccessKeySecret: config.aliyun.accesskey,
	                    AccountName: config.aliyun.dms.accountName
	                  });
	                }

	                client.SingleSendMail(options, function (err, res, body) {
	                  if (err) return reject(err);
	                  resolve({ email: email });
	                });

	                _context.next = 25;
	                break;

	              case 22:
	                _context.prev = 22;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 25:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 22]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 85 */
/***/ function(module, exports) {

	module.exports = require("ali-push");

/***/ },
/* 86 */
/***/ function(module, exports) {

	module.exports = require("joi");

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

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _crypto = __webpack_require__(90);

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
/* 88 */
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

	var _mongodb = __webpack_require__(89);

	var _config = __webpack_require__(47);

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
	            mongodbUrl = _ref2.mongodbUrl;
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
	              mongodbUrl = _ref4.mongodbUrl;
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
/* 89 */
/***/ function(module, exports) {

	module.exports = require("mongodb");

/***/ },
/* 90 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(92);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _ms = __webpack_require__(93);

	var _ms2 = _interopRequireDefault(_ms);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mutateInsertOne = __webpack_require__(94);

	var _mutateInsertOne2 = _interopRequireDefault(_mutateInsertOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */
	var queryCodeLevel = function queryCodeLevel(db, key) {
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
	                code: _joi2.default.string().length(6).required(),
	                createTime: _joi2.default.number().required()
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

	/**
	 * 检查验证码
	 */
	var checkCode = function checkCode(_ref2) {
	  var email = _ref2.email,
	      code = _ref2.code;
	  return new _promise2.default(function () {
	    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	      var db, result;
	      return _regenerator2.default.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.prev = 0;
	              _context2.next = 3;
	              return (0, _leveldb2.default)();

	            case 3:
	              db = _context2.sent.sub('emailcode');
	              _context2.next = 6;
	              return queryCodeLevel(db, email);

	            case 6:
	              result = _context2.sent;

	              if (result) {
	                _context2.next = 9;
	                break;
	              }

	              return _context2.abrupt('return', reject(new Error('ILLEGAL_CODE_A')));

	            case 9:
	              if (!(result.code !== code)) {
	                _context2.next = 11;
	                break;
	              }

	              return _context2.abrupt('return', reject(new Error('ILLEGAL_CODE_B')));

	            case 11:
	              if (!(Date.now() > result.createTime + (0, _ms2.default)('5m'))) {
	                _context2.next = 13;
	                break;
	              }

	              return _context2.abrupt('return', reject(new Error('EXPIRE_CODE')));

	            case 13:
	              _context2.next = 15;
	              return db.del(email);

	            case 15:
	              resolve(true);
	              _context2.next = 23;
	              break;

	            case 18:
	              _context2.prev = 18;
	              _context2.t0 = _context2['catch'](0);

	              if (!(_context2.t0.name === 'NotFoundError')) {
	                _context2.next = 22;
	                break;
	              }

	              return _context2.abrupt('return', reject(new Error('ILLEGAL_CODE')));

	            case 22:
	              reject(_context2.t0);

	            case 23:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, _callee2, undefined, [[0, 18]]);
	    }));

	    return function (_x2, _x3) {
	      return _ref3.apply(this, arguments);
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
	var createTokenByAuthCode = function createTokenByAuthCode(_ref4) {
	  var authCode = _ref4.authCode;
	  return new _promise2.default(function () {
	    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	      var db, result;
	      return _regenerator2.default.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              _context3.prev = 0;
	              _context3.next = 3;
	              return (0, _leveldb2.default)();

	            case 3:
	              db = _context3.sent.sub('ssocode');
	              _context3.next = 6;
	              return db.get(authCode);

	            case 6:
	              result = _context3.sent;

	              resolve({ token: result.token });
	              _context3.next = 13;
	              break;

	            case 10:
	              _context3.prev = 10;
	              _context3.t0 = _context3['catch'](0);

	              reject(_context3.t0);

	            case 13:
	            case 'end':
	              return _context3.stop();
	          }
	        }
	      }, _callee3, undefined, [[0, 10]]);
	    }));

	    return function (_x4, _x5) {
	      return _ref5.apply(this, arguments);
	    };
	  }());
	};

	var createUser = function createUser(email) {
	  return new _promise2.default(function () {
	    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
	      var db, result, user;
	      return _regenerator2.default.wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              _context4.prev = 0;
	              _context4.next = 3;
	              return (0, _mongodb2.default)();

	            case 3:
	              db = _context4.sent.collection('user');
	              _context4.next = 6;
	              return db.insertOne({
	                email: email, createTime: Date.now()
	              });

	            case 6:
	              result = _context4.sent;
	              user = result.ops[0];

	              resolve((0, _extends3.default)({}, user, { userId: user._id.toString() }));
	              _context4.next = 14;
	              break;

	            case 11:
	              _context4.prev = 11;
	              _context4.t0 = _context4['catch'](0);

	              reject(_context4.t0);

	            case 14:
	            case 'end':
	              return _context4.stop();
	          }
	        }
	      }, _callee4, undefined, [[0, 11]]);
	    }));

	    return function (_x6, _x7) {
	      return _ref6.apply(this, arguments);
	    };
	  }());
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    email: _joi2.default.string().required(),
	    driveId: _joi2.default.string(),
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
	      var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(resolve, reject) {
	        var validated, _validated$value, code, email, driveId, result, userId;

	        return _regenerator2.default.wrap(function _callee5$(_context5) {
	          while (1) {
	            switch (_context5.prev = _context5.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context5.next = 3;
	                  break;
	                }

	                return _context5.abrupt('return', reject(validated.error));

	              case 3:
	                _validated$value = validated.value, code = _validated$value.code, email = _validated$value.email, driveId = _validated$value.driveId;

	                // todo 发放OAuth授权令牌

	                _context5.prev = 4;
	                _context5.next = 7;
	                return checkCode({ email: email, code: code });

	              case 7:
	                _context5.next = 9;
	                return dispatch((0, _queryOne2.default)({ email: email, enableNull: true }));

	              case 9:
	                result = _context5.sent;

	                if (!(result === null)) {
	                  _context5.next = 16;
	                  break;
	                }

	                _context5.next = 13;
	                return createUser(email);

	              case 13:
	                _context5.t0 = _context5.sent.userId;
	                _context5.next = 17;
	                break;

	              case 16:
	                _context5.t0 = result.userId;

	              case 17:
	                userId = _context5.t0;

	                if (userId) {
	                  _context5.next = 20;
	                  break;
	                }

	                return _context5.abrupt('return', reject(new Error('EXCEPTION_ERROR')));

	              case 20:
	                _context5.t1 = resolve;
	                _context5.next = 23;
	                return dispatch((0, _mutateInsertOne2.default)({ id: userId, name: 'user', type: 'user' }));

	              case 23:
	                _context5.t2 = _context5.sent;
	                (0, _context5.t1)(_context5.t2);
	                _context5.next = 30;
	                break;

	              case 27:
	                _context5.prev = 27;
	                _context5.t3 = _context5['catch'](4);

	                reject(_context5.t3);

	              case 30:
	              case 'end':
	                return _context5.stop();
	            }
	          }
	        }, _callee5, undefined, [[4, 27]]);
	      }));

	      return function (_x8, _x9) {
	        return _ref7.apply(this, arguments);
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
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(89);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @private */
	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    userId: _joi2.default.string(),
	    email: _joi2.default.string(),
	    enableNull: _joi2.default.boolean().default(false)
	  }).xor(['userId', 'email']), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, userId, email, enableNull, filter, db, result;

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
	                _validated$value = validated.value, userId = _validated$value.userId, email = _validated$value.email, enableNull = _validated$value.enableNull;
	                _context.prev = 4;
	                filter = {};

	                if (userId) {
	                  filter._id = (0, _mongodb3.ObjectId)(userId);
	                } else {
	                  filter.email = email;
	                }
	                _context.next = 9;
	                return (0, _mongodb2.default)();

	              case 9:
	                db = _context.sent.collection('user');
	                _context.next = 12;
	                return db.findOne(filter);

	              case 12:
	                result = _context.sent;

	                if (!(result === null)) {
	                  _context.next = 17;
	                  break;
	                }

	                if (!enableNull) {
	                  _context.next = 16;
	                  break;
	                }

	                return _context.abrupt('return', resolve(null));

	              case 16:
	                return _context.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 17:
	                resolve((0, _extends3.default)({}, result, { userId: result._id.toString() }));
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
/* 93 */
/***/ function(module, exports) {

	module.exports = require("ms");

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = exports.createSecret = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _crypto = __webpack_require__(90);

	var _crypto2 = _interopRequireDefault(_crypto);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @private */

	var createSecret = exports.createSecret = function createSecret() {
	  return _crypto2.default.randomBytes(48).toString('hex');
	};

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    id: _joi2.default.string().required(),
	    name: _joi2.default.string().required(),
	    type: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, type, name, id, mongo, leveldb, tokendb, insertData, clientId;

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
	                _validated$value = validated.value, type = _validated$value.type, name = _validated$value.name, id = _validated$value.id;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                mongo = _context.sent.collection('client');
	                _context.next = 10;
	                return (0, _leveldb2.default)();

	              case 10:
	                leveldb = _context.sent;
	                tokendb = leveldb.sub('token');
	                insertData = {
	                  name: name, type: type, id: id,
	                  token: createSecret(),
	                  socketId: null,
	                  status: 1 // 0, disable, 1, not online 2, online
	                };
	                _context.next = 15;
	                return mongo.insertOne(insertData);

	              case 15:
	                clientId = _context.sent.ops[0]._id.toString();
	                _context.next = 18;
	                return tokendb.put(insertData.token, { name: name, type: type, token: insertData.token, id: id, clientId: clientId });

	              case 18:
	                resolve((0, _extends3.default)({}, insertData, { clientId: clientId }));
	                _context.next = 25;
	                break;

	              case 21:
	                _context.prev = 21;
	                _context.t0 = _context['catch'](4);

	                console.log(_context.t0);
	                reject(_context.t0);

	              case 25:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 21]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 95 */
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
/* 96 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _queryOne = __webpack_require__(92);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _queryOne3 = __webpack_require__(97);

	var _queryOne4 = _interopRequireDefault(_queryOne3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */
	var queryLevel = function queryLevel(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      var value, validated;
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.next = 3;
	              return db.get(key);

	            case 3:
	              value = _context.sent;
	              validated = _joi2.default.validate(value, _joi2.default.object().keys({
	                userId: _joi2.default.string().required(),
	                email: _joi2.default.string()
	              }), { allowUnknown: true });

	              if (!validated.error) {
	                _context.next = 7;
	                break;
	              }

	              return _context.abrupt('return', resolve(null));

	            case 7:
	              resolve(value);
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
	    token: _joi2.default.string().length(96).required()
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
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, token, db, userdb, _ref3, userId, user;

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
	                token = validated.value.token;
	                _context2.prev = 4;
	                _context2.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                db = _context2.sent;
	                userdb = db.sub('user');
	                _context2.next = 11;
	                return dispatch((0, _queryOne4.default)({ token: token }));

	              case 11:
	                _ref3 = _context2.sent;
	                userId = _ref3.id;
	                _context2.next = 15;
	                return queryLevel(userdb, userId);

	              case 15:
	                user = _context2.sent;

	                if (!(user === null)) {
	                  _context2.next = 21;
	                  break;
	                }

	                _context2.next = 19;
	                return dispatch((0, _queryOne2.default)({ userId: userId }));

	              case 19:
	                user = _context2.sent;

	                userdb.put(userId, user);

	              case 21:
	                resolve(user);
	                _context2.next = 29;
	                break;

	              case 24:
	                _context2.prev = 24;
	                _context2.t0 = _context2['catch'](4);

	                if (!(_context2.t0.name === 'NotFoundError')) {
	                  _context2.next = 28;
	                  break;
	                }

	                return _context2.abrupt('return', resolve(null));

	              case 28:
	                reject(_context2.t0);

	              case 29:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 24]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 97 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _queryOne = __webpack_require__(92);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _queryOne3 = __webpack_require__(98);

	var _queryOne4 = _interopRequireDefault(_queryOne3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @private */

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    token: _joi2.default.string().length(96),
	    socketId: _joi2.default.string(),
	    clientId: _joi2.default.string(),
	    withSourceData: _joi2.default.boolean().default(false)
	  }).xor(['token', 'clientId', 'socketId']), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$value, clientId, socketId, token, withSourceData, tokendb, client;

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
	                _validated$value = validated.value, clientId = _validated$value.clientId, socketId = _validated$value.socketId, token = _validated$value.token, withSourceData = _validated$value.withSourceData;
	                _context2.prev = 4;
	                _context2.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                tokendb = _context2.sent.sub('token');
	                _context2.next = 10;
	                return new _promise2.default(function () {
	                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	                    return _regenerator2.default.wrap(function _callee$(_context) {
	                      while (1) {
	                        switch (_context.prev = _context.next) {
	                          case 0:
	                            _context.prev = 0;
	                            _context.t0 = resolve;
	                            _context.next = 4;
	                            return tokendb.get(token);

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

	                  return function (_x3) {
	                    return _ref2.apply(this, arguments);
	                  };
	                }());

	              case 10:
	                client = _context2.sent;

	                if (!withSourceData) {
	                  _context2.next = 22;
	                  break;
	                }

	                if (!(client.type === 'user')) {
	                  _context2.next = 19;
	                  break;
	                }

	                _context2.next = 15;
	                return dispatch((0, _queryOne2.default)({ userId: client.id }));

	              case 15:
	                client.user = _context2.sent;

	                client.userId = client.id;
	                _context2.next = 22;
	                break;

	              case 19:
	                _context2.next = 21;
	                return dispatch((0, _queryOne4.default)({ appId: client.id, appName: client.name }));

	              case 21:
	                client.app = _context2.sent;

	              case 22:
	                resolve(client);
	                _context2.next = 28;
	                break;

	              case 25:
	                _context2.prev = 25;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 28:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 25]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 98 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().regex(/[a-z]{1, 1}[0-9a-z]{4, 30}/).required(),
	    appId: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * 获取处理请求的app, 并作负载均衡
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$error, appName, appId, filter, db, app, onlineItems, ts, randomNumber, randomIndex;

	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context2.next = 3;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 3:
	                _validated$error = validated.error, appName = _validated$error.appName, appId = _validated$error.appId, filter = _validated$error.filter;
	                _context2.prev = 4;
	                db = getCtx().leveldb.sub('app');
	                _context2.next = 8;
	                return queryLevel(db, appName);

	              case 8:
	                app = _context2.sent;

	                if (!(app === null)) {
	                  _context2.next = 11;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 11:
	                onlineItems = app.list.filter(function (service) {
	                  return service.status === 1;
	                });

	                if (!(onlineItems.length === 0)) {
	                  _context2.next = 14;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('TARGET_SERVICE_OFFLINE')));

	              case 14:
	                if (!appId) {
	                  _context2.next = 16;
	                  break;
	                }

	                return _context2.abrupt('return', resolve(onlineItems.find(function (item) {
	                  return item.appId === appId;
	                })));

	              case 16:
	                if (!(onlineItems.length === 1)) {
	                  _context2.next = 18;
	                  break;
	                }

	                return _context2.abrupt('return', resolve(onlineItems[0]));

	              case 18:
	                ts = String(Date.now());
	                randomNumber = Number(ts[ts.length - 1]);
	                randomIndex = Math.floor(randomNumber * onlineItems.length / 10);
	                return _context2.abrupt('return', resolve(app.list[randomIndex]));

	              case 24:
	                _context2.prev = 24;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 27:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 24]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 99 */
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
/* 100 */
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

	var _queryOneByFullPath = __webpack_require__(101);

	var _queryOneByFullPath2 = _interopRequireDefault(_queryOneByFullPath);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

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
	                return queryLevel(fileContentdb, fileId);

	              case 18:
	                cat = _context2.sent;

	                if (!(cat === null)) {
	                  _context2.next = 21;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 21:
	                resolve({ isFile: true, cat: cat });
	                _context2.next = 27;
	                break;

	              case 24:
	                _context2.prev = 24;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 27:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 24]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _ms = __webpack_require__(93);

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
	        var validated, _validated$value, fullPath, replaceWithIndexHTMLWhenIsFolder, syncIndexData, fileIndex, _ref5, cacheExpireTime, indexData;

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
	                return (0, _config2.default)();

	              case 11:
	                _ref5 = _context4.sent;
	                cacheExpireTime = _ref5.cacheExpireTime;
	                _context4.next = 15;
	                return queryLevel(fileIndex, fullPath);

	              case 15:
	                indexData = _context4.sent;

	                if (!(!indexData || Date.now() > indexData.updateTime + (0, _ms2.default)(cacheExpireTime) || !indexData.updateTime)) {
	                  _context4.next = 20;
	                  break;
	                }

	                _context4.next = 19;
	                return syncIndexData(fullPath);

	              case 19:
	                indexData = _context4.sent;

	              case 20:
	                if (!indexData.error) {
	                  _context4.next = 22;
	                  break;
	                }

	                return _context4.abrupt('return', reject(new Error(indexData.error)));

	              case 22:
	                if (!(indexData.type === 2 && replaceWithIndexHTMLWhenIsFolder)) {
	                  _context4.next = 27;
	                  break;
	                }

	                fullPath = fullPath + '/index.html';
	                _context4.next = 26;
	                return syncIndexData(fullPath);

	              case 26:
	                indexData = _context4.sent;

	              case 27:
	                resolve(indexData);
	                _context4.next = 33;
	                break;

	              case 30:
	                _context4.prev = 30;
	                _context4.t0 = _context4['catch'](5);

	                reject(_context4.t0);

	              case 33:
	              case 'end':
	                return _context4.stop();
	            }
	          }
	        }, _callee4, undefined, [[5, 30]]);
	      }));

	      return function (_x3, _x4) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 102 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(89);

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
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(89);

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
/* 104 */
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

	var _queryOneByFullPath = __webpack_require__(101);

	var _queryOneByFullPath2 = _interopRequireDefault(_queryOneByFullPath);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb = __webpack_require__(88);

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
	                  _context.next = 16;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('FILE_EXIST')));

	              case 16:
	                _context.next = 18;
	                return file.insertOne({ driveId: driveId, type: type, parentId: parentId, name: name });

	              case 18:
	                result = _context.sent;
	                id = result.insertedId.toString();

	                if (!(type === 1)) {
	                  _context.next = 23;
	                  break;
	                }

	                _context.next = 23;
	                return fileContent.put(id, content);

	              case 23:
	                resolve(result.ops[0]);
	                _context.next = 29;
	                break;

	              case 26:
	                _context.prev = 26;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 29:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 26]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 105 */
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

	var _path = __webpack_require__(52);

	var _path2 = _interopRequireDefault(_path);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mutateInsertOne = __webpack_require__(104);

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
/* 106 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mongodb3 = __webpack_require__(89);

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
/* 107 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _leveldb = __webpack_require__(53);

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
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _mongodb2 = __webpack_require__(88);

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
	        var validated, _validated$value, domain, driveId, name, fields, drive, filter, result;

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
	                _context.next = 11;
	                return drive.findOne(filter, { fields: fields });

	              case 11:
	                result = _context.sent;

	                if (result) {
	                  _context.next = 14;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('NOT_FOUND')));

	              case 14:
	                resolve((0, _extends3.default)({}, result, { driveId: result._id.toString() }));
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
/* 109 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _mongodb2 = __webpack_require__(88);

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
/* 110 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _mongodb2 = __webpack_require__(88);

	var _mongodb3 = _interopRequireDefault(_mongodb2);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

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
	                  return new _promise2.default(function (resolve) {
	                    return userdb.get(userId).then(resolve).catch(function () {
	                      return resolve(null);
	                    });
	                  });
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
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _queryOne = __webpack_require__(108);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _ms = __webpack_require__(93);

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
	        var validated, _validated$value, domain, forceSync, syncCache, _ref5, cacheExpireTime, apiDomain, db, target;

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
	                    var _ref4, pageDomain, pageDomainRegex, index, filter, driveData, cacheValue, db;

	                    return _regenerator2.default.wrap(function _callee2$(_context2) {
	                      while (1) {
	                        switch (_context2.prev = _context2.next) {
	                          case 0:
	                            _context2.prev = 0;
	                            _context2.next = 3;
	                            return (0, _config2.default)();

	                          case 3:
	                            _ref4 = _context2.sent;
	                            pageDomain = _ref4.pageDomain;
	                            pageDomainRegex = new RegExp('.' + pageDomain + '$');
	                            index = domain.search(pageDomainRegex);
	                            filter = index === -1 ? { domain: domain } : {
	                              name: domain.substring(0, index)
	                            };
	                            _context2.next = 10;
	                            return dispatch((0, _queryOne2.default)((0, _extends3.default)({}, filter, { fields: ['locations'] })));

	                          case 10:
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

	                            _context2.next = 15;
	                            return (0, _leveldb2.default)();

	                          case 15:
	                            db = _context2.sent.sub('domain');
	                            _context2.next = 18;
	                            return db.put(domain, cacheValue);

	                          case 18:
	                            _context2.next = 23;
	                            break;

	                          case 20:
	                            _context2.prev = 20;
	                            _context2.t0 = _context2['catch'](0);

	                            console.log(_context2.t0);

	                          case 23:
	                          case 'end':
	                            return _context2.stop();
	                        }
	                      }
	                    }, _callee2, undefined, [[0, 20]]);
	                  }));

	                  return function syncCache() {
	                    return _ref3.apply(this, arguments);
	                  };
	                }();

	                _context3.prev = 5;
	                _context3.next = 8;
	                return (0, _config2.default)();

	              case 8:
	                _ref5 = _context3.sent;
	                cacheExpireTime = _ref5.cacheExpireTime;
	                apiDomain = _ref5.apiDomain;

	                if (!(domain === apiDomain)) {
	                  _context3.next = 13;
	                  break;
	                }

	                return _context3.abrupt('return', resolve({
	                  driveId: '',
	                  locations: [{
	                    "pathname": "*",
	                    "cors": true,
	                    "type": "SEASHELL",
	                    "content": ""
	                  }]
	                }));

	              case 13:
	                _context3.next = 15;
	                return (0, _leveldb2.default)();

	              case 15:
	                db = _context3.sent.sub('domain');
	                _context3.next = 18;
	                return queryLevel(db, domain);

	              case 18:
	                target = _context3.sent;

	                if (!(!target || target.disable)) {
	                  _context3.next = 22;
	                  break;
	                }

	                reject(new Error('NOT_FOUND'));
	                return _context3.abrupt('return', process.nextTick(syncCache));

	              case 22:
	                resolve(target);
	                if (forceSync || Date.now() > target.updateTime + (0, _ms2.default)(cacheExpireTime)) process.nextTick(syncCache);
	                _context3.next = 29;
	                break;

	              case 26:
	                _context3.prev = 26;
	                _context3.t0 = _context3['catch'](5);

	                reject(_context3.t0);

	              case 29:
	              case 'end':
	                return _context3.stop();
	            }
	          }
	        }, _callee3, undefined, [[5, 26]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 112 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(108);

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
/* 113 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(108);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _mongodb = __webpack_require__(88);

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
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, _validated$value, name, description, session, userId, driveData, drive, result;

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
	                _validated$value = validated.value, name = _validated$value.name, description = _validated$value.description;
	                _context2.prev = 4;
	                session = getCtx().request.headers.session;

	                console.log(session);

	                if (session) {
	                  _context2.next = 9;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 9:
	                userId = session ? session.userId : '123';
	                _context2.next = 12;
	                return new _promise2.default(function () {
	                  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	                    return _regenerator2.default.wrap(function _callee$(_context) {
	                      while (1) {
	                        switch (_context.prev = _context.next) {
	                          case 0:
	                            _context.prev = 0;
	                            _context.t0 = resolve;
	                            _context.next = 4;
	                            return dispatch((0, _queryOne2.default)({ name: name }));

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

	                  return function (_x3) {
	                    return _ref2.apply(this, arguments);
	                  };
	                }());

	              case 12:
	                driveData = _context2.sent;

	                if (!driveData) {
	                  _context2.next = 15;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('NAME_EXIST')));

	              case 15:
	                _context2.next = 17;
	                return (0, _mongodb2.default)();

	              case 17:
	                drive = _context2.sent.collection('drive');
	                _context2.next = 20;
	                return drive.insertOne({
	                  name: name,
	                  description: description,
	                  domains: [],
	                  locations: [],
	                  users: [userId],
	                  adminId: userId,
	                  status: 1 });

	              case 20:
	                result = _context2.sent;

	                resolve(result.ops[0]);
	                _context2.next = 27;
	                break;

	              case 24:
	                _context2.prev = 24;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 27:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 24]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 114 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(89);

	var _mongodb2 = __webpack_require__(88);

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
/* 115 */
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

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb3 = __webpack_require__(89);

	var _queryOne = __webpack_require__(108);

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
/* 116 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

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
/* 117 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _mongodb3 = __webpack_require__(89);

	var _union = __webpack_require__(118);

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
/* 118 */
/***/ function(module, exports) {

	module.exports = require("lodash/union");

/***/ },
/* 119 */
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

	var _letiny = __webpack_require__(82);

	var _letiny2 = _interopRequireDefault(_letiny);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _config = __webpack_require__(47);

	var _config2 = _interopRequireDefault(_config);

	var _os = __webpack_require__(48);

	var _mkdirp = __webpack_require__(120);

	var _mkdirp2 = _interopRequireDefault(_mkdirp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    domain: _joi2.default.string().required(),
	    driveId: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, domain, driveId, _ref2, email, datadir, pemdir;

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
	                _validated$value = validated.value, domain = _validated$value.domain, driveId = _validated$value.driveId;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _config2.default)();

	              case 7:
	                _ref2 = _context.sent;
	                email = _ref2.https.email;
	                datadir = _ref2.datadir;
	                pemdir = datadir + '/pem';

	                _mkdirp2.default.sync(pemdir + '/' + domain);
	                _letiny2.default.getCert({
	                  email: email,
	                  domains: domain, //'example.com,www.example.com',
	                  webroot: '' + (0, _os.tmpdir)(),
	                  certFile: pemdir + '/' + domain + '/cert.pem',
	                  caFile: pemdir + '/' + domain + '/ca.pem',
	                  privateKey: pemdir + '/' + domain + '/key.pem',
	                  accountKey: pemdir + '/' + domain + '/account.pem',
	                  agreeTerms: true
	                }, function (err) {
	                  if (err) return reject(err);
	                  return resolve({ error: null });
	                });
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
/* 120 */
/***/ function(module, exports) {

	module.exports = require("mkdirp");

/***/ },
/* 121 */
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

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().required(),
	    appToken: _joi2.default.string().length(96).required()
	  }), { allowUnknown: true });
	};

	/**
	 * get app detail
	 * @returns {Promise}
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, appName, appToken, db, detail;

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
	                _validated$value = validated.value, appName = _validated$value.appName, appToken = _validated$value.appToken;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _leveldb2.default)();

	              case 7:
	                db = _context.sent.sub('apptoken');
	                _context.next = 10;
	                return db.get(appToken);

	              case 10:
	                detail = _context.sent;

	                resolve(detail);
	                _context.next = 19;
	                break;

	              case 14:
	                _context.prev = 14;
	                _context.t0 = _context['catch'](4);

	                if (!(_context.t0.name !== 'NotFoundError')) {
	                  _context.next = 18;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('NO_SESSION')));

	              case 18:
	                reject(_context.t0);

	              case 19:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 14]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validate = undefined;

	var _extends2 = __webpack_require__(18);

	var _extends3 = _interopRequireDefault(_extends2);

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* @public */

	/**
	 * Create App Group
	 */

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().required()
	  }), { allowUnknown: true });
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
	        var validated, appName, session, db, app;
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
	                appName = validated.value.appName;
	                _context2.prev = 4;
	                session = getCtx().request.headers.session;

	                if (session) {
	                  _context2.next = 8;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 8:
	                _context2.next = 10;
	                return (0, _mongodb2.default)();

	              case 10:
	                db = _context2.sent.collection('app');
	                _context2.next = 13;
	                return db.findOne({ appName: appName });

	              case 13:
	                app = _context2.sent;

	                if (!(app !== null)) {
	                  _context2.next = 16;
	                  break;
	                }

	                return _context2.abrupt('return', reject(new Error('APP_NAME_EXIST')));

	              case 16:
	                _context2.next = 18;
	                return db.insertOne({
	                  appName: appName,
	                  permissions: [],
	                  adminId: session.userId
	                });

	              case 18:
	                app = _context2.sent.ops[0];


	                resolve((0, _extends3.default)({}, app, { appId: app._id.toString() }));
	                _context2.next = 25;
	                break;

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
/* 123 */
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

	var _unbind = __webpack_require__(124);

	var _unbind2 = _interopRequireDefault(_unbind);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var validated, appName, db, detail;
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
	                appName = validated.value.appName;
	                _context2.prev = 4;
	                db = getCtx().leveldb.sub('app');
	                _context2.next = 8;
	                return db.del(appName);

	              case 8:
	                detail = _context2.sent;
	                _context2.next = 11;
	                return _promise2.default.all(detail.list.map(function (item) {
	                  return new _promise2.default(function () {
	                    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
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
	                      return _ref2.apply(this, arguments);
	                    };
	                  }());
	                }));

	              case 11:

	                resolve(detail || {});
	                _context2.next = 17;
	                break;

	              case 14:
	                _context2.prev = 14;
	                _context2.t0 = _context2['catch'](4);

	                reject(_context2.t0);

	              case 17:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[4, 14]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 124 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mutateUpdateStatus = __webpack_require__(125);

	var _mutateUpdateStatus2 = _interopRequireDefault(_mutateUpdateStatus);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    socketId: _joi2.default.string().required()
	  }));
	};

	/**
	 * delete socket
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, socketId;
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
	                socketId = validated.value.socketId;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mutateUpdateStatus2.default)({
	                  toStatus: 1,
	                  socketId: socketId
	                });

	              case 7:
	                _context.next = 12;
	                break;

	              case 9:
	                _context.prev = 9;
	                _context.t0 = _context['catch'](4);

	                console.log(_context.t0);

	              case 12:

	                resolve({});

	              case 13:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 9]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var deleteLevelItem = function deleteLevelItem(db, key) {
	  return new _promise2.default(function () {
	    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
	      return _regenerator2.default.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.prev = 0;
	              _context.t0 = resolve;
	              _context.next = 4;
	              return db.del(key);

	            case 4:
	              _context.t1 = _context.sent;
	              (0, _context.t0)(_context.t1);
	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t2 = _context["catch"](0);

	              resolve();

	            case 11:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, undefined, [[0, 8]]);
	    }));

	    return function (_x) {
	      return _ref.apply(this, arguments);
	    };
	  }());
	}; /* @private */

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    name: _joi2.default.string(),
	    id: _joi2.default.string(),
	    clientId: _joi2.default.string(),
	    socketId: _joi2.default.string().required(),
	    toStatus: _joi2.default.number().valid([1, 2]).required(),
	    token: _joi2.default.string().length(96)
	  }), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
	        var validated, _validated$value, name, id, socketId, clientId, toStatus, token, mongo, socketdb, result, _result;

	        return _regenerator2.default.wrap(function _callee3$(_context3) {
	          while (1) {
	            switch (_context3.prev = _context3.next) {
	              case 0:
	                validated = validate(query);

	                if (!validated.error) {
	                  _context3.next = 3;
	                  break;
	                }

	                return _context3.abrupt("return", reject(validated.error));

	              case 3:
	                _validated$value = validated.value, name = _validated$value.name, id = _validated$value.id, socketId = _validated$value.socketId, clientId = _validated$value.clientId, toStatus = _validated$value.toStatus, token = _validated$value.token;
	                _context3.prev = 4;
	                _context3.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                mongo = _context3.sent.collection('client');
	                _context3.next = 10;
	                return (0, _leveldb2.default)();

	              case 10:
	                socketdb = _context3.sent.sub('socket');

	                if (!(toStatus === 1)) {
	                  _context3.next = 18;
	                  break;
	                }

	                _context3.next = 14;
	                return mongo.findOneAndUpdate({ socketId: socketId }, { $set: {
	                    status: 1,
	                    socketId: null
	                  } }, { returnOriginal: false });

	              case 14:
	                result = _context3.sent.value;
	                _context3.next = 17;
	                return deleteLevelItem(socketdb, socketId);

	              case 17:
	                return _context3.abrupt("return", resolve(result));

	              case 18:
	                if (!(toStatus === 2)) {
	                  _context3.next = 25;
	                  break;
	                }

	                _context3.next = 21;
	                return mongo.findOneAndUpdate({ id: id, name: name, token: token }, { $set: {
	                    status: 2,
	                    socketId: socketId
	                  } }, { returnOriginal: false });

	              case 21:
	                _result = _context3.sent.value;
	                _context3.next = 24;
	                return new _promise2.default(function () {
	                  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve) {
	                    return _regenerator2.default.wrap(function _callee2$(_context2) {
	                      while (1) {
	                        switch (_context2.prev = _context2.next) {
	                          case 0:
	                            _context2.prev = 0;
	                            _context2.t0 = resolve;
	                            _context2.next = 4;
	                            return socketdb.put(socketId, { id: id, name: name });

	                          case 4:
	                            _context2.t1 = _context2.sent;
	                            (0, _context2.t0)(_context2.t1);
	                            _context2.next = 11;
	                            break;

	                          case 8:
	                            _context2.prev = 8;
	                            _context2.t2 = _context2["catch"](0);

	                            reject(_context2.t2);

	                          case 11:
	                          case "end":
	                            return _context2.stop();
	                        }
	                      }
	                    }, _callee2, undefined, [[0, 8]]);
	                  }));

	                  return function (_x4) {
	                    return _ref3.apply(this, arguments);
	                  };
	                }());

	              case 24:
	                return _context3.abrupt("return", resolve(_result));

	              case 25:
	                _context3.next = 30;
	                break;

	              case 27:
	                _context3.prev = 27;
	                _context3.t0 = _context3["catch"](4);

	                reject(_context3.t0);

	              case 30:
	              case "end":
	                return _context3.stop();
	            }
	          }
	        }, _callee3, undefined, [[4, 27]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 126 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    limit: _joi2.default.number().default(20),
	    fields: _joi2.default.array().default(['appName', 'permissions'])
	  }), { allowUnknown: true });
	};

	/**
	 * get app list
	 * @returns {Promise}
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, limit, fields, filter, session, db, data;

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

	                return _context.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 8:
	                filter.adminId = session.userId;
	                _context.prev = 9;
	                _context.next = 12;
	                return (0, _mongodb2.default)();

	              case 12:
	                db = _context.sent.collection('app');
	                _context.next = 15;
	                return db.find(filter, { fields: fields }).limit(limit).toArray();

	              case 15:
	                data = _context.sent;

	                resolve({ data: data });
	                _context.next = 22;
	                break;

	              case 19:
	                _context.prev = 19;
	                _context.t0 = _context['catch'](9);

	                reject(_context.t0);

	              case 22:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[9, 19]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 127 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _mutateInsertOne = __webpack_require__(94);

	var _mutateInsertOne2 = _interopRequireDefault(_mutateInsertOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appName: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * app create
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, appName, session, db, tokendb, app, _ref2, token, permissions, adminId;

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
	                appName = validated.value.appName;
	                _context.prev = 4;
	                session = getCtx().request.headers.session;

	                if (session) {
	                  _context.next = 8;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('PERMISSION_DENIED')));

	              case 8:
	                _context.next = 10;
	                return (0, _mongodb2.default)();

	              case 10:
	                db = _context.sent.collection('app');
	                _context.next = 13;
	                return (0, _leveldb2.default)();

	              case 13:
	                tokendb = _context.sent.sub('apptoken');
	                _context.next = 16;
	                return db.findOne({ appName: appName, adminId: session.userId });

	              case 16:
	                app = _context.sent;

	                if (app) {
	                  _context.next = 19;
	                  break;
	                }

	                return _context.abrupt('return', reject(new Error('APP_NOT_FOUNT')));

	              case 19:
	                _context.next = 21;
	                return dispatch((0, _mutateInsertOne2.default)({
	                  id: app._id.toString(), type: 'app', name: appName
	                }));

	              case 21:
	                _ref2 = _context.sent;
	                token = _ref2.token;
	                permissions = app.permissions, adminId = app.adminId;
	                _context.next = 26;
	                return tokendb.put(token, {
	                  updateTime: Date.now(),
	                  appName: appName,
	                  adminId: adminId,
	                  permissions: permissions,
	                  appId: app._id.toString()
	                });

	              case 26:
	                resolve({ token: token });
	                _context.next = 32;
	                break;

	              case 29:
	                _context.prev = 29;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

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
/* 128 */
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

	var _mutateOne = __webpack_require__(129);

	var _mutateOne2 = _interopRequireDefault(_mutateOne);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appId: _joi2.default.string().required(),
	    appName: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * delete a app and all related sockets
	 * @returns {Promise}
	 * @constructor
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, appId, appName, db, app;

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
	                _validated$value = validated.value, appId = _validated$value.appId, appName = _validated$value.appName;
	                _context.prev = 4;
	                db = getCtx().leveldb.sub('app');
	                _context.next = 8;
	                return db.get(appName);

	              case 8:
	                app = _context.sent;

	                app.list = app.list.filter(function (item) {
	                  return item.appId !== appId;
	                });
	                _context.next = 12;
	                return dispatch((0, _mutateOne2.default)({ appName: appName, app: app }));

	              case 12:
	                resolve({});
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
/* 129 */
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

	var _leveldb = __webpack_require__(53);

	var _leveldb2 = _interopRequireDefault(_leveldb);

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appId: _joi2.default.string().required()
	  }), { allowUnknown: true });
	}; /* @public */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, appId, appName, app, db;
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
	                appId = validated.value.appId;
	                _context.prev = 4;
	                appName = query.appName, app = query.app;
	                _context.next = 8;
	                return (0, _leveldb2.default)();

	              case 8:
	                db = _context.sent.sub('app');
	                _context.next = 11;
	                return db.put(appName, app);

	              case 11:
	                resolve({ success: 1 });

	                _context.next = 17;
	                break;

	              case 14:
	                _context.prev = 14;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 17:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 14]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 130 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mongodb = __webpack_require__(88);

	var _mongodb2 = _interopRequireDefault(_mongodb);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    limit: _joi2.default.number().min(1).max(100).default(20),
	    name: _joi2.default.string(),
	    id: _joi2.default.string(),
	    fields: _joi2.default.array().default(['status', 'name', 'id'])
	  }).xor(['name', 'id']), { allowUnknown: true });
	};

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, limit, fields, name, id, db, filter, data;

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
	                _validated$value = validated.value, limit = _validated$value.limit, fields = _validated$value.fields, name = _validated$value.name, id = _validated$value.id;
	                _context.prev = 4;
	                _context.next = 7;
	                return (0, _mongodb2.default)();

	              case 7:
	                db = _context.sent.collection('client');
	                filter = { $or: [] };

	                fields = fields.filter(function (item) {
	                  return item !== 'token';
	                });
	                if (name) filter.$or.push({ name: name });
	                if (id) filter.$or.push({ id: id });
	                if (filter.$or.length === 0) delete filter.$or;
	                _context.next = 15;
	                return db.find(filter, { fields: fields }).limit(limit).toArray();

	              case 15:
	                data = _context.sent;

	                resolve({ data: data });
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
/* 131 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _queryOne = __webpack_require__(97);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	var _query = __webpack_require__(130);

	var _query2 = _interopRequireDefault(_query);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var validate = exports.validate = function validate(query) {
	  return _joi2.default.validate(query, _joi2.default.object().keys({
	    appId: _joi2.default.string(),
	    appName: _joi2.default.string().required()
	  }), { allowUnknown: true });
	};

	/**
	 * 如果有appId，那么返回的socketId必须和appId一致，否则返回null
	 * 如果没有appId，默认随机返回一个
	 * 如果没找到socketId（都不在线），则返回null
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
	        var validated, _validated$value, appName, appId, socketId, _ref2, data, result;

	        return _regenerator2.default.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                validated = validate(query);
	                _validated$value = validated.value, appName = _validated$value.appName, appId = _validated$value.appId;
	                socketId = null;
	                _context.prev = 3;

	                if (!appId) {
	                  _context.next = 10;
	                  break;
	                }

	                _context.next = 7;
	                return dispatch((0, _queryOne2.default)({ clientId: appId })).socketId;

	              case 7:
	                socketId = _context.sent;
	                _context.next = 16;
	                break;

	              case 10:
	                _context.next = 12;
	                return dispatch((0, _query2.default)({ name: appName, fields: ['socketId'] }));

	              case 12:
	                _ref2 = _context.sent;
	                data = _ref2.data;
	                result = data.find(function (item) {
	                  return item.socketId !== null;
	                });

	                socketId = result ? result.socketId : null;

	              case 16:
	                _context.next = 21;
	                break;

	              case 18:
	                _context.prev = 18;
	                _context.t0 = _context['catch'](3);

	                console.log(_context.t0);

	              case 21:
	                resolve({ socketId: socketId });

	              case 22:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[3, 18]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 132 */
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

	var _joi = __webpack_require__(86);

	var _joi2 = _interopRequireDefault(_joi);

	var _mutateUpdateStatus = __webpack_require__(125);

	var _mutateUpdateStatus2 = _interopRequireDefault(_mutateUpdateStatus);

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
	        var validated, _validated$value, socketId, _validated$value$regi, appName, appId, appSecret;

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
	                _validated$value = validated.value, socketId = _validated$value.socketId, _validated$value$regi = _validated$value.registerInfo, appName = _validated$value$regi.appName, appId = _validated$value$regi.appId, appSecret = _validated$value$regi.appSecret;
	                _context.prev = 4;
	                _context.next = 7;
	                return dispatch((0, _mutateUpdateStatus2.default)({
	                  id: appId,
	                  token: appSecret,
	                  name: appName,
	                  toStatus: 2,
	                  socketId: socketId
	                }));

	              case 7:
	                resolve({ socketId: socketId });
	                _context.next = 13;
	                break;

	              case 10:
	                _context.prev = 10;
	                _context.t0 = _context['catch'](4);

	                reject(_context.t0);

	              case 13:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, undefined, [[4, 10]]);
	      }));

	      return function (_x, _x2) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.queryLevel = undefined;

	var _regenerator = __webpack_require__(3);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _asyncToGenerator2 = __webpack_require__(5);

	var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

	var _promise = __webpack_require__(2);

	var _promise2 = _interopRequireDefault(_promise);

	var _queryOne = __webpack_require__(97);

	var _queryOne2 = _interopRequireDefault(_queryOne);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	/**
	 * 根据 socketId / switch-identify 获取app信息
	 * @returns {Promise}
	 */

	exports.default = function (query) {
	  return function (dispatch, getCtx) {
	    return new _promise2.default(function () {
	      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
	        var headers, session, _headers$switchIdent, token, name, type, socketdb;

	        return _regenerator2.default.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                headers = query.headers;
	                session = null;
	                _context2.prev = 2;

	                if (!headers.hasOwnProperty('switch-identity')) {
	                  _context2.next = 12;
	                  break;
	                }

	                _headers$switchIdent = headers['switch-identity'], token = _headers$switchIdent.appSecret, name = _headers$switchIdent.appName;
	                type = name === 'user' ? 'user' : 'app';

	                if (!token) {
	                  _context2.next = 10;
	                  break;
	                }

	                _context2.next = 9;
	                return dispatch((0, _queryOne2.default)({ token: token, withSourceData: true }));

	              case 9:
	                session = _context2.sent;

	              case 10:
	                _context2.next = 17;
	                break;

	              case 12:
	                if (!query.socketId) {
	                  _context2.next = 17;
	                  break;
	                }

	                socketdb = getCtx().leveldb.sub('socket');
	                _context2.next = 16;
	                return queryLevel(socketdb, query.socketId);

	              case 16:
	                session = _context2.sent;

	              case 17:
	                _context2.next = 22;
	                break;

	              case 19:
	                _context2.prev = 19;
	                _context2.t0 = _context2['catch'](2);

	                console.log(_context2.t0);

	              case 22:
	                resolve(session);

	              case 23:
	              case 'end':
	                return _context2.stop();
	            }
	          }
	        }, _callee2, undefined, [[2, 19]]);
	      }));

	      return function (_x2, _x3) {
	        return _ref2.apply(this, arguments);
	      };
	    }());
	  };
	};

/***/ }
/******/ ]);