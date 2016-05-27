import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import todos from './todos'
import host from './host'

export default combineReducers({
  routing,
  host,
  todos
})
