import * as API from '../../../sdk/api'

/**
 * 渲染我的app列表
 */
const getHostList = (page=1)=> {
  return async (dispatch, getState) => {
    try {
      const data = await API.getHostList()
      const list = data.list
      dispatch({
        type: "HOST_LIST_UPDATE",
        hostList: list
      })
    } catch(e){
      console.error(e)
    }
  }
}

export default getHostList