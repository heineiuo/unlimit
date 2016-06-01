import * as API from '../../../sdk/api'

/**
 * 新建或保存路由
 * @param nextLocation
 * @returns {function()}
 */
 const editLocation = (nextLocation)=>{
  return async(dispatch, getState) =>{

    try {

      const response = await API.editLocation(nextLocation)

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