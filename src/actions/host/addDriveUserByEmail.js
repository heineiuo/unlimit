import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../../constants'
import editDriveUser from './editDriveUser'

export default ({email, driveId}) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  let result = {}
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/account/getUserIdByEmail`,{
      token, email
    })
  } catch(e){
    result.error = e
  }
  if (result.error) return alert(result.error)
  dispatch(editDriveUser({driveId, add: [{email, id: result.id||result.userId}]}))
}