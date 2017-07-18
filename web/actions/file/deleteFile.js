import Fetch from '@shared/fetch'


const deleteFile = (driveId, fileId) => async (dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${global.__SMILE_API}/seashell/fs/mutateDelete`, {
    token,
    driveId,
    fileId
  }).post();
  if (result.error) return console.log(result.error)
};

export default deleteFile;
