import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const deleteFile = (driveId, pathname) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;

    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/unlink`, {
      action: 'unlink',
      token,
      driveId,
      pathname
    });
    if (result.error) throw result.error

  } catch(e){
    console.log(e);
  }
};

export default module.exports = deleteFile;