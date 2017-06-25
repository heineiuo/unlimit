import Fetch from '@shared/fetch'


export default (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState();
  const {driveId, content} = query;
  let result = {};
  try {
    result = await new Fetch(`${global.__SMILE_API}/seashell/fs/mutateFileContent`, {
      token,
      driveId,
      fileId,
      content,
    }).post();
  } catch(e){
    result.error = e;
  }
  if (result.error) return console.error(result.error);
  dispatch({
    type: '@@file/state/update',
    payload: {state: 2, fileContentState: 2}
  })
};
