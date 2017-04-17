import {POSTRawJSON} from "fetch-tools"
import {API_HOST} from "../../constants"
/**
 * 删除host
 * @returns {function()}
 */
const deleteHost = (driveId) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const result = await POSTRawJSON(`${API_HOST}/seashell/drive/remove`, {
    driveId,
    token
  });

  if (result.error) return console.log(result.error)

  dispatch({
    type: 'host__remove',
    payload: {driveId}
  })

};

export default module.exports = deleteHost;