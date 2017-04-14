import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const deleteFile = (driveId, pathname) => async (dispatch, getState) => {
  const {token} = getState().account;
  let result = null;
  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/fs/unlink`, {
      action: 'unlink',
      token,
      driveId,
      pathname
    });
  } catch(e){
    return console.log(e);
  }

  if (result.error) throw result.error
};

export default module.exports = deleteFile;