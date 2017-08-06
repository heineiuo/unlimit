import uuid from 'uuid'
import { match, when } from 'match-when'
import { injectAsyncReducer } from '@react-web/store'

const initialState = {
  stack: []
};

const reducer = (state=initialState, action) => match(action.type, {

  /**
   * 初始化
   */
  [when('@@notice/init')]: () => {
    return Object.assign({}, initialState)
  },

  /**
   */
  [when('@@notice/ERROR_PUSH')]: () => {
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
  [when('@@notice/clear')]: () => {
    return Object.assign({}, state, {
      stack: []
    })
  },

  [when()]: state

})

export default reducer

injectAsyncReducer('notice', reducer)

export const showError = (error) => (dispatch, getState) => {
  dispatch({
    type: '@@notice/ERROR_PUSH',
    payload: {
      type: 'error',
      notice: error
    }
  })
};
