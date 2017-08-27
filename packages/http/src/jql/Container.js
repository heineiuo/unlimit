import vm from 'vm'
import EventEmitter from 'events'
import isPlainObject from 'lodash/isPlainObject'
import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux'
import thunkMiddleware from 'redux-thunk'
import defaults from 'lodash/defaults'
import fs from 'fs'
import util from 'util'
import crypto from 'crypto'
import async_hooks from 'async_hooks'

const acorn = require('acorn')
const { AsyncResource } = async_hooks

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') console.warn(action)
  return next(action)
}

/**
 * setTimtout, setInterval, setImmediate, process.nextTick, Promise is forbidden
 * because it callback may throw error in container environment
 */
export const defaultEnv = vm.createContext({
  Promise: () => { 
    throw new SyntaxError('Promise is disabled in JQL. But async/await is allowed') 
  }
})

const defaultParamsReducer = (state={}, action) => state
const defaultRequestReducer = (state={}, action) => state
const defaultResponseReducer = (state={}, action) => state

class Container {
  constructor(options={}) {
    Object.assign(this, {
      timeout: 30000,
      scriptEnv: defaultEnv,
      externalEnv: defaultEnv,
      actions: {},
      reducers: {},
      middlewares: {},
      externalActions: {},
      externalReducers: {}
    }, options)
    defaults(this.reducers, {
      params: defaultParamsReducer,
      request: defaultRequestReducer,
      response: defaultResponseReducer,
    })
    defaults(this.middlewares, {
      thunkMiddleware
    })

    this.enableHook()
  }

  enableHook = () => {

    const init = (type, asyncId) => {
      const eid = async_hooks.executionAsyncId();
      if (this._execs.hasOwnProperty(eid) && asyncId != eid ) {
        fs.writeSync(
          1, `init: type: ${type}, asyncId: (${asyncId}), executionId: ${eid}\n`
        )
      }
    }

    const after = (asyncId) => {
      const eid = async_hooks.executionAsyncId();
      if (this._execs.hasOwnProperty(eid) && asyncId != eid ) {
        fs.writeSync(
          1, `after: asyncId: (${asyncId}), executionId: ${eid}\n`
        )
      }
    }
    async_hooks.createHook({ init, after }).enable()
  }
  
  replaceActions = (actions) => this.actions = actions
  replaceReducers = (reducers) => {
    return Object.assign({}, {
      params: defaultParamsReducer,
      request: defaultRequestReducer,
      response: defaultResponseReducer,
    }, reducers)
  }
  replaceMiddlewares = (middlewares) => {
    this.middlewares = Object.assign({}, middlewares, { thunkMiddleware })
  }
  
  replaceExternalActions = (obj) => {
    this.externalActions = {}
    Object.keys(obj).forEach(key => {
      this.externalActions[key] = vm.runInContext(`(${String(obj[key])})`, externalEnv)
    })
  }

  replaceExternalReducers = (obj) => {
    this.externalReducers = {}
    Object.keys(obj).forEach(key => {
      this.externalReducers[key] = vm.runInContext(String(obj[key]), externalEnv)
    })
  }

  createStore = (defaultState) => {
    const createStoreWithMiddleware = applyMiddleware.apply(
      this, Object.values(this.middlewares)
    )(createStore)

    const store = createStoreWithMiddleware(
      combineReducers(
        Object.assign({}, this.externalReducers, this.reducers)
      ), defaultState
    )

    return {
      getState: () => Object.assign({}, store.getState()),
      ...bindActionCreators(
        Object.assign({}, this.externalActions, this.actions), 
        store.dispatch
      )
    }
  }

  _execs = {}
  
  exec = (script, defaultState={}) => new Promise(async (resolve, reject) => {
    const asyncId = async_hooks.executionAsyncId()
    const listener = this._execs[asyncId] = new EventEmitter()
    listener.once('error', error => {
      reject(error)
      listener.removeAllListeners()
      delete this._execs[asyncId]
    })

    try {
      acorn.parse(script, {
        ecmaVersion: 8,
        sourceType: 'script',
        onToken: (token) => {
          if (token.type.label === 'while') {
            throw new SyntaxError('while is disabled')
          }
        }
      })

      const filename = `${crypto.randomBytes(10)}.js`
      const contextifiedScript = vm.runInContext(script, this.scriptEnv, {
        displayErrors: true,
        filename
      })

      const store = this.createStore(defaultState)
      setTimeout(() => {
        if (this._execs[asyncId]) {
          listener.removeAllListeners()
          delete this._execs[asyncId]
          const error = new Error('Uncaught exception occured, please try catch your query or actions')
          error.name = 'UncaughtExceptionError'
          reject(error)
        }
      }, this.timeout)
      

      const result = await contextifiedScript(store)
      listener.removeAllListeners()
      delete this._execs[asyncId]
      resolve(result)
    } catch (e) {
      e.name = `JQL::${e.name}`
      listener.emit(e)
    } finally {
      console.log('finally')
    }
  })
}


process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})


export default Container
