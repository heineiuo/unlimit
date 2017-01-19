import { handleActions } from 'redux-actions'

const initialState = {
  history: [],
  pwd: ''
}

export default handleActions({

  HISTORY_PUSH (state, action) {
    const history = state.history.slice()
    history.push(action.newHistory)
    return Object.assign({}, state, {history})
  }

}, initialState)
