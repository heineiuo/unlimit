import Fetch from '@shared/fetch'
const {API_HOST} = global

export default (query) => async (dispatch, getState) => {
  const {account: {token}, file: {fileId}} = getState();
  const {driveId, content} = query;
  let result = {};
  try {
    result = await new Fetch(`${API_HOST}/seashell/fs/mutateFileContent`, {
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
    payload: {state: 2}
  })
};
