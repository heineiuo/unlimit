import {POSTRawJSON} from "fetch-tools"
import {API_HOST} from "../../constants"

export default (query) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const {driveId} = query;
  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/drive/userList`, {
      token, driveId
    })
    if (result.error) throw result.error
  } catch(e){
    return console.error(e)
  }
  dispatch({
    type: 'host__driveUserUpdate',
    payload: {
      driveUserState: 2,
      driveUserList: result.list,
      driveUserAdmin: result.admin
    }
  })
}