import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../../constants'
import getDriveUserList from './getDriveUserList'

export default (query) => async (dispatch, getState) => {

  const {add=[], remove=[], driveId} = query;
  const {account: {token}, host: {driveUserList}} = getState();
  const backup = driveUserList.slice();

  const handleError = (e) => {
    alert(e)
    dispatch({
      type: 'host__driveUserUpdate',
      payload: {
        driveUserState: 2,
        driveUserList: backup
      }
    })
  }

  let nextDriveUserList = driveUserList.slice()
    .filter(item => remove.findIndex(r => r.id === item.id) === -1)
    .concat(add)

  dispatch({
    type: "host__driveUserUpdate",
    payload: {
      driveUserState: 3,
      driveUserList: nextDriveUserList
    }
  })
  let result = {};
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/drive/editUsers`, {
      token, driveId,
      add: add.map(item => item.id),
      remove: remove.map(item => item.id),
    })
  } catch(e){
    result.error = e;
  }
  if (result.error) return handleError(result.error)

  dispatch({
    type: "host__driveUserUpdate",
    payload: {
      driveUserState: 2,
    }
  })
}