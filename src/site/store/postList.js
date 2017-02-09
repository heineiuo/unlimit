import { handleActions } from 'redux-actions'
import {showError} from './notice'

const initialState = {
  list: [],
};


export default handleActions({

  POST_LIST_UPDATE (state, action) {
    const {payload} = action;
    return Object.assign({}, state, {
      list: payload.list
    })
  },

}, initialState)
