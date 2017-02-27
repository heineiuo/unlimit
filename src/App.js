import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {Router, Route, IndexRoute, createMemoryHistory, hashHistory, browserHistory} from 'react-router'
import { createStore, applyMiddleware, combineReducers, bindActionCreators } from 'redux'
import {routerMiddleware, syncHistoryWithStore, routerReducer} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import notice from './store/feed/notice'
import postList from './store/feed/postList'
import account from './store/account'

class App extends Component {

  componentWillMount = () => {

    const history = hashHistory;

    const historyMiddleware = routerMiddleware(history);

    const loggerMiddleware = store => next => action => {
      console.error(action);
      return next(action)
    };

    const create = window.devToolsExtension
      ? window.devToolsExtension()(createStore)
      : createStore;

    const createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      historyMiddleware
    )(create);


    const createReducer = (asyncReducers) => {
      return combineReducers({
        routing: routerReducer,
        notice,
        postList,
        account,
        ...asyncReducers
      });
    };

    const store = this._store = createStoreWithMiddleware(createReducer({}), {});
    store.asyncReducers = {};

    this._history = syncHistoryWithStore(history, store);

    this._injectAsyncReducer = (name, asyncReducer) => {
      store.asyncReducers[name] = asyncReducer;
      store.replaceReducer(createReducer(store.asyncReducers));
    };
  };

  componentWillUnmount = () => {
    console.error('WTF! Root Component Will Unmount!')
  };

  render (){
    console.error('This should not happened again !!!');

    return (
      <Provider store={this._store}>
        <Router history={this._history} routes={require('./routes')(this._injectAsyncReducer)} />
      </Provider>
    )
  }
}

module.exports = App;