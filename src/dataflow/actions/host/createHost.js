import * as API from '../../../sdk/api'
import { push } from 'react-router-redux'

/**
 * 添加host
 */
 const createHost = (opts)=> {
  return async (dispatch, getState) => {
    try {
      const data = await API.createHost(opts)
      if (data.error) throw new Error(data.error)
      const hostId = data.host._id
      dispatch(push(`/host/${hostId}`))
    } catch(e){
      alert(`${e}${JSON.stringify(e.stack||{})}`)
    }
  }
}

export default createHost