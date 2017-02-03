import { handleActions } from 'redux-actions'

const initialState = {
  title: ''
};

export default handleActions({

  NAV_TITLE_UPDATE (state, action) {
    return Object.assign({}, state, {
      title: action.payload.title
    })
  }

}, initialState)

export const setTitle = (title) => ({
  type: 'NAV_TITLE_UPDATE',
  payload: {title}
});
