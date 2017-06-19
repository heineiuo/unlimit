import Fetch from '@shared/fetch'
const {API_HOST} = global
import {push} from 'react-router-redux'
import {restoreFileList} from '../file/restoreFileList'

/**
 * 更新locations
 * @param driveId
 * @param locations
 */
const commitLocations = (driveId, locations) => async(dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${API_HOST}/seashell/drive/commitLocations`,{
    token,
    driveId,
    locations: locations.map(location => {
      delete location.sort;
      delete location.contentType;
      return location
    })
  }).post();

  if (result.error) return console.log(result.error);
  dispatch({
    type: "host__locationUpdate",
    payload: {
      driveId,
      locations
    }
  })
};


export default commitLocations;
