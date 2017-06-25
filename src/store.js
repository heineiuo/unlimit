/**
 * ootb store
 * 
 * import: redux, react-router-redux, redux-thunk, history, warning, react-redux
 * 
 * import Peer: react, react-dom|react-native, react-router-native|react-router-dom
 * 
 * export: {
 *  connect, bindActionCreators, store, history, injectAsyncReducer, AppWrapper
 * }
 */

import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux'
import {routerReducer, routerMiddleware, ConnectedRouter} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import createHashHistory from 'history/createHashHistory'
import warning from 'warning'
import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

const history = createHashHistory()
const historyMiddleware = routerMiddleware(history)

const loggerMiddleware = store => next => action => {
  if (process.env.NODE_ENV !== 'production') console.warn(action)
  return next(action)
};

const create = global.devToolsExtension ? global.devToolsExtension()(createStore) : createStore;

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  historyMiddleware
)(create)

const createReducer = (asyncReducers) => combineReducers({
  router: routerReducer,
  routing: routerReducer,
  ...asyncReducers
})

const store = createStoreWithMiddleware(createReducer({}), {})
store.asyncReducers = {}

const injectAsyncReducer = (name, asyncReducer, force=false) => {
  warning(!store.hasOwnProperty(name) || force, `${name} has been injected, if you want to replace it, use force=true argument`)
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(store.asyncReducers))
}


export {
  store, 
  history, 
  injectAsyncReducer,

}
