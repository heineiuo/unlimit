import {POSTRawJSON} from "fetch-tools"
import {API_HOST} from "../../constants"

export default (query) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const {driveId} = query;
  const result = await POSTRawJSON(`${API_HOST}/seashell/drive/queryUsers`, {
    token, driveId
  })
  if (result.error) return console.log(result.error);

  dispatch({
    type: 'host__driveUserUpdate',
    payload: {
      driveUserState: 2,
      driveUserList: result.data,
    }
  })
}