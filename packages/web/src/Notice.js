/**
 * 全局通知
 */

import uuid from 'uuid'
import { handleActions } from 'redux-actions'
import { injectAsyncReducer } from '@react-web/store'

const initialState = {
  stack: []
};

injectAsyncReducer('notice', handleActions({

  /**
   * 初始化
   */
  notice__init (state, action) {
    return Object.assign({}, initialState)
  },

  /**
   */
  notice__pushError (state, action) {
    const nextStack = state.stack.slice();
    const id = uuid.v4();
    nextStack.push(Object.assign({}, action.notice, {
      id,
      type: 'error',
    }));
    return Object.assign({}, state, {stack: nextStack})
  },

  /**
   */
  notice__clear (state, action) {
    return Object.assign({}, state, {
      stack: []
    })
  },

}, initialState))



export const showError = (error) => (dispatch, getState) => {
  dispatch({
    type: 'notice__pushError',
    payload: {
      type: 'error',
      notice: error
    }
  })
};
