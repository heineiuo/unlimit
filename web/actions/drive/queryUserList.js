import Fetch from "@shared/fetch"
const {API_HOST} = global

export default (query) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const {driveId} = query;
  const result = await new Fetch(`${API_HOST}/seashell/drive/queryUsers`, {
    token, driveId
  }).post();
  if (result.error) return console.log(result.error);

  dispatch({
    type: 'host__driveUserUpdate',
    payload: {
      driveUserState: 2,
      driveUserList: result.data,
    }
  })
}
