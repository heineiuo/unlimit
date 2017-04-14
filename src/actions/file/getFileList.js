import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const getFileList = (driveId, pathname='/') => async (dispatch, getState) => {
  dispatch({
    type: 'file__stateUpdate',
    payload: {
      fileState: 1
    }
  });

  const {account: {token}} = getState();
  let result = null;

  try {
    result = await POSTRawJSON(`${API_HOST}/seashell/fs/ls`, {
      driveId, pathname, token
    });
  } catch(e){
    console.log(e.stack)
  }

  if (result.error) return console.log(result.error)

  dispatch({
    type: 'file__listUpdate',
    payload: result
  })

};

export default module.exports = getFileList;