import { handleActions } from 'redux-actions'

const initialState = {
  history: [],
  pwd: ''
};

export default handleActions({

  HISTORY_PUSH (state, action) {
    const history = state.history.slice();
    history.push(action.newHistory);
    return Object.assign({}, state, {history})
  }

}, initialState)

/**
 * 发送命令
 * @returns {function()}
 */
export const sendCommand = (command) => async(dispatch, getState) => {
  try {
    const {pwd} = getState().terminal;
    const result = await POSTRawJSON(`${API_HOST}/api/gateway/command/send`, {command});
    if (result.error) throw result.error;
    dispatch({
      type: 'HISTORY_PUSH',
      newHistory: {
        pwd: pwd,
        command: command,
        result: result.result
      }
    })
  } catch (e) {
    console.log(e)
  }
};