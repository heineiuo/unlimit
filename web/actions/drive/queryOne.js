import Fetch from "@shared/fetch"
const {API_HOST} = global

export default (driveId) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const result = await await new Fetch(`${API_HOST}/seashell/drive/queryOne`, {
    driveId,
    token,
    fields: ['domains', 'locations', 'name', 'adminId']
  }).post();

  if (result.error) throw new Error(result.error);
  const {domains, locations, name, adminId} = result;
  dispatch({
    type: "host__metaUpdate",
    payload: {
      driveId, domains, locations, name, adminId
    }
  })
};

