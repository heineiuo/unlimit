import { handleActions } from 'redux-actions'

const initialState = {
  ls: [],
  isFile: false,
  // isDirectory: true,
  cat: '',
  fileState: 0,
  clipboard: []
};

export default handleActions({

  file__stateUpdate (state, action) {
    return Object.assign({}, state, action.payload)
  },

  file__listUpdate (state, action) {
    return Object.assign({}, state, action.payload, {fileState: 2})
  },
  file__clipboardUpdate (state, action) {
    return Object.assign({}, state, {clipboard: action.payload.clipboard})
  },

  file__clipboardEmpty (state, action) {
    return Object.assign({}, state, {clipboard: []})
  }

}, initialState)