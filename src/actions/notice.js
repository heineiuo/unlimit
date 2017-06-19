/**
 * 全局通知
 */

import uuid from 'uuid'
import { handleActions } from 'redux-actions'


const initialState = {
  stack: []
};

export default  handleActions({

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

}, initialState)


