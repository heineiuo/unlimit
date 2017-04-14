import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'

/**
 * 更新我的app列表
 */
const getHostList = () => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const handleError = (e) => console.error(e);
  let hostListResult = null;

  dispatch({
    type: 'host__stateUpdate',
    payload: {
      hostListState: 1,
    }
  });

  try {
    hostListResult = await POSTRawJSON(`${API_HOST}/seashell/drive/list`,{
      limit: 0, token
    });
  } catch(e){
    return handleError(e)
  }

  if (hostListResult.error) return handleError(hostListResult.error);
  dispatch({
    type: "host__listUpdate",
    payload: {
      hostList: hostListResult.list,
    }
  });
};


export default module.exports = getHostList;