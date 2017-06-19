import Fetch from '@shared/fetch'
const {API_HOST} = global

export default (driveId) => async (dispatch, getState) => {
  dispatch({
    type: '@@file/state/update',
    payload: {
      fileState: 1
    }
  });

  const {account: {token}, file: {fileId}} = getState();
  const result = await new Fetch(`${API_HOST}/seashell/fs/queryFileContent`, {
    driveId,
    fileId,
    token
  }).post();

  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@file/list/update',
    payload: result
  })
};
