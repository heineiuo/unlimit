import { handleActions } from 'redux-actions'
import defaultsDeep from 'lodash.defaultsdeep'
import defaults from 'lodash.defaults'

const initialState = {
  hostList: [],
  locationList: [],

  hostname: '',
  host: {},
  location: {},

  // 正在加载详情
  loadingHostDetail: true,

  loadingLocationList: true
}

export default handleActions({
  HOST_LIST_UPDATE (state, action) {
    return defaults({
      hostname: action.hostname,
      hostList: action.hostList
    }, state)
  },

  UPDATE_LOCATION_LIST (state, action) {
    return defaults({
      loadingLocationList: false,
      locationList: action.locationList,
      host: action.host,
      hostname: action.hostname
    }, state)
  },

  UPDATE_LOCATION_DETAIL (state, action) {
    return defaults({
      hostname: action.hostname,
      location: action.location
    }, state)
  }

}, initialState)
