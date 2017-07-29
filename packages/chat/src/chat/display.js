import { handleActions } from 'redux-actions'
import {checkAutoMarkRead} from './messagelist'

const initialState = {
  opened: false,
};

const noop = () => {};

export default handleActions({

  DISPLAY_UPDATE_TOGGLE_OPEN (state, action) {
    return {
      opened: typeof action.payload.opened == 'boolean' ?  action.payload.opened:!state.opened
    }
  },

}, initialState)

export const toggleOpen = (opened) => (dispatch, getState) => {
  dispatch(checkAutoMarkRead());
  dispatch({
    type: 'DISPLAY_UPDATE_TOGGLE_OPEN',
    payload: {opened}
  })
};