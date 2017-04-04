import {API_HOST} from '../../constants'

/**
 * 发送命令
 * @returns {function()}
 */
const sendCommand = (command) => async(dispatch, getState) => {
  try {
    const {pwd} = getState().terminal;
    const result = await POSTRawJSON(`${API_HOST}/seashell/command/send`, {command});
    if (result.error) throw result.error;
    dispatch({
      type: 'terminal__pushHistory',
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

export default module.exports = sendCommand