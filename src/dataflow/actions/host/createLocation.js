import * as API from '../../../sdk/api'

/**
 * 新建路由
 * @param nextLocation
 * @returns {function()}
 */
const createLocation = (nextLocation)=>{
  return async(dispatch, getState) =>{

    try {

      const state = getState()
      nextLocation.host_id = state.host.hostId
      const response = await API.createLocation(nextLocation)
      if (response.error) throw new Error(response.error)

      dispatch({
        type: 'UPDATE_LOCATION',
        nextLocation: nextLocation
      })

    } catch(e){
      alert(e)
    }

  }
}

export default createLocation