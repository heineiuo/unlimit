import Fetch from 'fetch-tools'
import {API_HOST} from '../../constants'


const deleteFile = (driveId, fileId) => async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${API_HOST}/seashell/fs/mutateDelete`, {
    token,
    driveId,
    fileId
  }).post();
  if (result.error) return console.log(result.error)
};

export default deleteFile;
