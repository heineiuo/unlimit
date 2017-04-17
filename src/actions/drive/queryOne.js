import {POSTRawJSON} from "fetch-tools"
import {API_HOST} from "../../constants"

export default (driveId) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const result = await await POSTRawJSON(`${API_HOST}/seashell/drive/queryOne`, {
    driveId,
    token,
    fields: ['domains', 'locations', 'name', 'adminId']
  });

  if (result.error) throw new Error(result.error);
  const {domains, locations, name, adminId} = result;
  dispatch({
    type: "host__metaUpdate",
    payload: {
      driveId, domains, locations, name, adminId
    }
  })
};

