import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const getFileList = (driveId, pathname='/') => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'file__stateUpdate',
      payload: {
        fileState: 1
      }
    });

    const {token} = getState().account;
    const result = await POSTRawJSON(`${API_HOST}/seashell/fs/ls`, {
      driveId, pathname, token
    });

    if (result.error) throw new Error(result.error);

    dispatch({
      type: 'file__listUpdate',
      payload: result
    })

  } catch(e){
    console.log(e.stack)
  }
};

export default module.exports = getFileList