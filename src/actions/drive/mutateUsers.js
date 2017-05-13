import Fetch from 'fetch-tools'
import {API_HOST} from '../../constants'
import getDriveUserList from './queryUserList'

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

  const result = await new Fetch(`${API_HOST}/seashell/drive/mutateUser`, {
    token, driveId,
    add: add.map(item => item.id),
    remove: remove.map(item => item.id),
  }).post();

  if (result.error) return handleError(result.error)

  dispatch({
    type: "host__driveUserUpdate",
    payload: {
      driveUserState: 2,
    }
  })
}
