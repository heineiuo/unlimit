import * as API from '../../../sdk/api'

/**
 * 添加host
 */
 const createHost = ()=> {
  return async (dispatch, getState) => {
    try {
      const data = await API.createHost()
      dispatch({
        type: "HOST_CREATE_ONE",
        hostList: list
      })
    } catch(e){
      alert(e)
    }

  }
}

export default createHost