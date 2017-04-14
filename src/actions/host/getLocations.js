import {POSTRawJSON} from "fetch-tools"
import {API_HOST} from "../../constants"

/**
 * 更新location列表
 * @param driveId
 */
export default (driveId) => async (dispatch, getState) => {
  dispatch({
    type: "host__stateUpdate",
    payload: {
      locationState: 1
    }
  });
  const {account: {token}} = getState();
  let hostDetailResult = null
  try {
    hostDetailResult = await await POSTRawJSON(`${API_HOST}/seashell/drive/getMeta`, {
      driveId,
      token
    });
  } catch (e) {
    return console.log(e.stack)
  }

  if (hostDetailResult.error) throw new Error(hostDetailResult.error);
  dispatch({
    type: "host__locationUpdate",
    payload: {
      driveId,
      locations: hostDetailResult.location.locations
    }
  })
};

