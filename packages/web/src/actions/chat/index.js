import { createStore, applyMiddleware, combineReducers } from 'redux'
import {routerMiddleware} from 'react-router-redux'
import {routerReducer as routing} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import account from './account'
import messagelist from './messagelist'
import ws from './ws'
import friends from './friends'
import searchuser from './searchuser'
import display from './display'
import theme from './theme'


const rootReducer = combineReducers({
  routing,
  account,
  messagelist,
  friends,
  ws,
  display,
  theme,
  searchuser
});

const configure = function (history, initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  /**
   * 生成router的中间件, 便于使用 `dispatch(push('/path'))`
   */
  const historyMiddleware = routerMiddleware(history);

  const logger = store => next => action => {
    if (process.env.NODE_ENV == 'development') {
      console.log('dispatching: ', action);
      console.log('next  state: ', store.getState())
    }
    return next(action)
  };

  // applyMiddleware() 告诉 createStore() 如何处理中间件
  const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,//Redux 处理异步  允许 dispatch() 函数
    logger,// 一个很便捷的 middleware，用来打印 action 日志
    historyMiddleware
  )(create);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  // if (module.hot) {
  //   module.hot.accept('./reducers.js', () => {
  //     const nextReducer = require('./reducers');
  //     store.replaceReducer(nextReducer)
  //   })
  // }

  return store
};


export default configure
