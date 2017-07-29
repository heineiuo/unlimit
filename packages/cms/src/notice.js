import { handleActions } from 'redux-actions'

const initialState = {
  detail: {},
};

export default handleActions({

  NOTICE_PUSH (state, action) {
    const {payload} = action;
    return Object.assign({pending: false}, state, {
      detail: payload
    })
  },

}, initialState)

