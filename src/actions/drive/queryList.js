import Fetch from "fetch-tools"
import {API_HOST} from "../../constants"

/**
 * 更新我的app列表
 */
const getHostList = () => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const handleError = (e) => console.error(e);

  dispatch({
    type: 'host__stateUpdate',
    payload: {
      hostListState: 1,
    }
  });

  const result = await new Fetch(`${API_HOST}/seashell/drive/queryMeta`, {
    limit: 0, token, fields: ['name']
  }).post();

  if (result.error) return handleError(result.error);
  dispatch({
    type: "host__hostListUpdate",
    payload: {
      hostList: result.data,
    }
  });
};


export default getHostList;
