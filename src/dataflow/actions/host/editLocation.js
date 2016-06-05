import * as API from '../../../sdk/api'

/**
 * 编辑路由
 * @param nextLocation
 * @returns {function()}
 */
 const editLocation = (nextLocation)=>{
  return async(dispatch, getState) =>{
    try {
      const response = await API.editLocation(nextLocation)
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

export default editLocation