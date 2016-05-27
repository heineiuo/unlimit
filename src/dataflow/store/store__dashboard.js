import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger } from '../middleware'
import rootReducer from '../reducers/reducer__dashboard'
import {routerMiddleware} from 'react-router-redux'


const configure = function (history, initialState) {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    routerMiddleware(history),
    thunkMiddleware,
    logger
  )(create)

  const store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducers/reducer__dashboard', () => {
      const nextReducer = require('../reducers/reducer__dashboard')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}


export default configure