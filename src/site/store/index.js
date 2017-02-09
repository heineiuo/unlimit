import { createStore, applyMiddleware, combineReducers } from 'redux'
import {routerMiddleware, routerReducer as routing} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import postList from './postList'
import postItem from './postItem'

const reducers = {
  postList,
  postItem
};

const rootReducer = combineReducers({
  routing,
  ...reducers,
});

const loggerMiddleware = store => next => action => {
  console.log(action);
  return next(action)
};


const configure = function (history, initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  /**
   * 生成router的中间件, 便于使用 `dispatch(push('/path'))`
   */
  const historyMiddleware = routerMiddleware(history);

  const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    historyMiddleware
  )(create);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     const nextReducer = require('./reducers');
  //     store.replaceReducer(nextReducer)
  //   })
  // }

  return store
};


export default configure
