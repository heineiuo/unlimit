import * as API from '../../../sdk/api'

/**
 * 排序,设置优先级
 * @returns {function()}
 */
const editLocationSort = (location, arrow)=>{


  return async(dispatch, getState)=>{
    try {

      const sort = Number(location.sort)
      const targetSort = sort + (arrow=='up'?-1:1)
      if (targetSort < 1) return false
      const response = await API.editLocationSort(location._id, targetSort)
      if (response.error) throw response.error

      const host_id = location.host_id
      const data = await API.getLocationList(host_id)
      if (data.error) throw data.error
      dispatch({
        type: "UPDATE_LOCATION_LIST",
        host: data.host,
        hostId: host_id,
        locationList: data.list
      })


    } catch(e){
      alert(e)
    }
  }
}


export default editLocationSort 