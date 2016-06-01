import * as API from '../../../sdk/api'

/**
 * 获取location列表
 * @returns {function()}
 */
const getHostLocationList = (host_id)=>{
  return async (dispatch, getState)=>{
    try {
      const data = await API.getLocationList(host_id)
      if (data.error) throw data.error
      dispatch({
        type: "UPDATE_LOCATION_LIST",
        host: data.host,
        hostId: host_id,
        locationList: data.list
      })
    } catch(e) {
      console.log(e)
      alert(e)
    }
  }
}

export default getHostLocationList