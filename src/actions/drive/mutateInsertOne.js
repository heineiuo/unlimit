import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 添加host
 */
const createHost = (query) => async (dispatch, getState) => {
  const {name, description} = query;
  const {account: {token}} = getState();
  const result = await POSTRawJSON(`${API_HOST}/seashell/drive/mutateInsertOne`, {
    token,
    name,
    description,
  });
  if (result.error) return alert(result.error);

  dispatch({
    type: 'host__add',
    payload: {
      name: query.name
    }
  });

  dispatch(push(`/drive/${result._id}`))
};

export default module.exports = createHost;