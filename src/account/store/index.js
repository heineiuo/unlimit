import { createStore, applyMiddleware, combineReducers } from 'redux'
import {routerMiddleware} from 'react-router-redux'
import { routerReducer as routing } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'

import account from './account'

const rootReducer = combineReducers({
  routing,
  account
});

const configure = function (history, initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const historyMiddleware = routerMiddleware(history);

  const loggerMiddleware = store => next => action => {
    console.log(action);
    return next(action)
  };

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


export default module.exports = configure