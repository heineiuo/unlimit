import { handleActions } from 'redux-actions'
import defaultsDeep from 'lodash.defaultsdeep'

const initialState = {
  hostList: [],
  locationList: [],

  currentHostId: '',
  currentHost: {},

  // 正在加载详情
  loadingHostDetail: true,

  loadingLocationList: true
}

export default handleActions({
  'HOST_LIST_UPDATE' (state, action) {
    return defaultsDeep({
      currentHostId: action.currentHostId,
      hostList: action.hostList
    }, state)
  },

  'UPDATE_LOCATION_LIST' (state, action) {
    return defaultsDeep({
      loadingLocationList: false,
      locationList: action.locationList,
      currentHost: action.currentHost,
      currentHostId: action.currentHostId
    }, state)
  }
}, initialState)
