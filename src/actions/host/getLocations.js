import {POSTRawJSON} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 更新location列表
 * @param driveId
 */
const getLocations = (driveId) => async (dispatch, getState) => {
  try {

    dispatch({
      type: "host__stateUpdate",
      payload: {
        locationState: 1
      }
    });

    const {token} = getState().account;
    const hostDetailResult = await await POSTRawJSON(`${API_HOST}/seashell/drive/getMeta`,{
      driveId,
      token
    });

    if (hostDetailResult.error) throw new Error(hostDetailResult.error);
    dispatch({
      type: "host__locationUpdate",
      payload: {
        driveId,
        locations: hostDetailResult.location.locations
      }
    })

  } catch(e){
    console.log(e.stack)
  }
};


export default module.exports = getLocations