import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const getFileList = (driveId, parentId=null) => async (dispatch, getState) => {
  dispatch({
    type: 'file__stateUpdate',
    payload: {
      fileState: 1
    }
  });

  const {account: {token}} = getState();
  const result = await POSTRawJSON(`${API_HOST}/seashell/fs/queryFile`, {
    driveId, parentId, token,
    replaceWithFileMetaIfIsFile: true
  });

  if (result.error) return console.log(result.error)
  dispatch({
    type: 'file__listUpdate',
    payload: result.data ? {ls: result.data, isFile: false} : result
  })

};

export default getFileList;
