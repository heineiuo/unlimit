import { handleActions } from 'redux-actions'

const initialState = {
  title: ''
};

export default handleActions({

  nav__titleUpdate (state, action) {
    return Object.assign({}, state, {
      title: action.payload.title
    })
  }

}, initialState)


