import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'
/**
 * 删除host
 * @returns {function()}
 */
const deleteHost = (driveId) => async (dispatch, getState) =>{
  try {
    const {token} = getState().account;
    await POSTRawJSON(`${API_HOST}/seashell/drive/remove`, {
      driveId,
      token
    });
    dispatch({
      type: 'host__remove',
      payload: {driveId}
    })
  }catch(e){
    console.log(e.stack)
  }
};

export default module.exports = deleteHost;