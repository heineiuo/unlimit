// dataflow/reducer/error.js
import uuid from 'uuid'

/**
 * 全局通知
 */

import { handleActions } from 'redux-actions'

const initialState = {
  stack: []
};

export default  handleActions({

  /**
   * 初始化
   */
  NOTICE_INIT (state, action) {
    return Object.assign({}, initialState)
  },

  /**
   */
  NOTICE_ERROR_PUSH (state, action) {
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
  NOTICE_CLEAR (state, action) {
    return Object.assign({}, state, {
      stack: []
    })
  },

}, initialState)


export const showError = (error) => (dispatch, getState) => {
  dispatch({
    type: 'NOTICE_ERROR_PUSH',
    payload: {
      type: 'error',
      notice: error
    }
  })

};