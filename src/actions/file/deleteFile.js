import { GETJSON, POSTRawJSON, Mock, Urlencode } from 'fetch-tools'
import {API_HOST} from '../../constants'


const deleteFile = (driveId, fileId) => async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await POSTRawJSON(`${API_HOST}/seashell/fs/mutateDelete`, {
    token,
    driveId,
    fileId
  });
  if (result.error) return console.log(result.error)
};

export default deleteFile;
