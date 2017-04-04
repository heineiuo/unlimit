import { handleActions } from 'redux-actions'

const initialState = {
  history: [],
  pwd: ''
};

export default handleActions({

  terminal__pushHistory (state, action) {
    const history = state.history.slice();
    history.push(action.newHistory);
    return Object.assign({}, state, {history})
  }

}, initialState)

