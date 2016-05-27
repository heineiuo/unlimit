
import { handleActions } from 'redux-actions'

const initialState = {
  hostList: []
}

export default handleActions({
  'add todo' (state, action) {
    return {
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: false,
      text: action.payload
    }
  }
}, initialState)
