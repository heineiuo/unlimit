import * as API from '../../../sdk/api'

/**
 * 获取路由配置详情
 */

const getRouterDetail = (host_id, location_id) => {
  return async (dispatch, getState) => {
    try {

      const body = await API.getLocationDetail(host_id, location_id)

      if (body.error) throw body.error
      dispatch({
        type: 'UPDATE_LOCATION_DETAIL',
        host: body.host,
        location: body.location
      })


    } catch(e){
      console.error(e)
      alert(e)
    }
  }
}

export default getRouterDetail