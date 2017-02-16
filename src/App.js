import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {Router, Route, IndexRoute, createMemoryHistory, hashHistory} from 'react-router'
import { createStore, applyMiddleware, combineReducers, bindActionCreators } from 'redux'
import {routerMiddleware, syncHistoryWithStore, routerReducer} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

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
        notice: require('./store/feed/notice').default,
        postList: require('./store/feed/postList').default,
        account: require('./store/account').default,
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
    console.error('Root Component Will Unmount!')
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