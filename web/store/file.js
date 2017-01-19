import { handleActions } from 'redux-actions'

const initialState = {
  ls: []
};

export default handleActions({

  FILE_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {
      ls: action.ls
    })
  }

}, initialState)
