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
  const {token} = getState().account;
  let response = null;
  try {
    response = await POSTRawJSON(`${API_HOST}/seashell/drive/commitLocations`,{
      token,
      driveId,
      locations: locations.map(location => {
        delete location.sort;
        delete location.contentType;
        return location
      })
    });
  } catch(e){
    console.log(e.stack);
    return alert(e.message)
  }

  if (response.error) return console.log(response.error);
  dispatch({
    type: "host__locationUpdate",
    payload: {
      driveId,
      locations
    }
  })
};


export default module.exports = commitLocations;