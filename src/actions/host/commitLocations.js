import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 更新locations
 * @param driveId
 * @param locations
 */
const commitLocations = (driveId, locations) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const response = await POSTRawJSON(`${API_HOST}/seashell/drive/commitLocations`,{
      token,
      driveId,
      locations: locations.map(location => {
        delete location.sort;
        delete location.contentType;
        return location
      })
    });
    if (response.error) throw new Error(response.error);

    dispatch({
      type: "host__locationUpdate",
      payload: {
        driveId,
        locations
      }
    })

  } catch(e){
    console.log(e.stack);
    alert(e.message)
  }
};


export default module.exports = commitLocations