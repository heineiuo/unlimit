import { handleActions } from 'redux-actions'
import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../constants'
import {push} from 'react-router-redux'
import {restoreFileList} from './file'

const initialState = {
  hostDefault: '',
  hostList: [],
  hostname: '',
  locations: {},

  hostListState: 0, // 0=not init, 1=loading, 2=ready
  locationState: 0, // 0=not init, 1=loading, 2=ready
};

export default handleActions({
  HOST_STATE_UPDATE (state, action) {
    return Object.assign({}, state, action.payload)
  },

  HOST_LIST_UPDATE (state, action) {
    return Object.assign({}, state, action.payload, {
      hostListState: 2,
    })
  },

  HOST_SWITCH (state, action) {
    return Object.assign({}, state, action.payload, {locationState: 0})
  },

  HOST_ADD (state, action) {
    const nextHostList = state.hostList.concat({
      hostname: action.payload.hostname
    });
    return Object.assign({}, state, {hostList: nextHostList})
  },

  HOST_REMOVE (state, action) {
    const nextHostList = state.hostList.filter(item => {
      return item.hostname != action.payload.hostname
    });
    return Object.assign({}, state, {hostList: nextHostList})

  },

  HOST_LOCATION_UPDATE (state, action) {
    return Object.assign({}, state, action.payload, {
      locationState: 2
    })
  },

  HOST_LOCATION_EDIT (state, action) {
    const newLocationItem = action.payload.nextLocation;
    const nextLocations = Object.assign({}, state.locations, {
      [newLocationItem.pathname]: newLocationItem
    });
    return Object.assign({}, state, {
      locations: nextLocations
    })
  },

  HOST_LOCATION_ADD (state, action) {
    const newLocationItem = action.payload.nextLocation;
    const nextLocations = Object.assign({}, state.locations, {
      [newLocationItem.pathname]: newLocationItem
    });

    return Object.assign({}, state, {
      locations: nextLocations
    })
  },

}, initialState)



/**
 * 更新我的app列表
 */
export const getHostList = (currentHostname=null) => async (dispatch, getState) => {
  try {
    dispatch({
      type: 'HOST_STATE_UPDATE',
      payload: {
        hostListState: 1,
      }
    });

    const {token} = getState().account;
    const hostListResult = await POSTRawJSON(`${API_HOST}/seashell/drive/list`,{
      limit: 0, token
    });

    if (hostListResult.error) throw new Error(hostListResult.error);

    if (hostListResult.list.length === 0) {
      // todo
      throw new Error('空间数量为零！')

    } else {
      const hostDefault = hostListResult.list[0].hostname;

      if (currentHostname) {
        const currentHostnameIndex = hostListResult.list.findIndex(item => {
          return item.hostname === currentHostname
        });
        if (currentHostnameIndex) {

          return dispatch({
            type: "HOST_LIST_UPDATE",
            payload: {
              hostList: hostListResult.list,
              hostDefault,
              hostname: currentHostname
            }
          });
        }
      }

      dispatch({
        type: "HOST_LIST_UPDATE",
        payload: {
          hostList: hostListResult.list,
          hostDefault,
          hostname: hostDefault,
        }
      });
    }

  } catch(e){
    alert(e.message);
    console.log(e.stack)
  }
};


/**
 * 添加host
 */
export const createHost = (form) => async (dispatch, getState) => {
  try {
    const data = await POSTRawJSON(`${API_HOST}/seashell/drive/create`, {
      hostnames: [form.hostname],
      locations: []
    });
    if (data.error) throw new Error(data.error);
    dispatch({
      type: 'HOST_ADD',
      payload: {
        hostname: form.hostname
      }
    });

    dispatch(push(`/${form.driveId}`))
  } catch(e){
    console.log(`${e}${JSON.stringify(e.stack||{})}`)
  }
};



/**
 * 删除host
 * @returns {function()}
 */
export const deleteHost = (driveId) => async (dispatch, getState) =>{
  try {
    const {token} = getState().account;
    await POSTRawJSON(`${API_HOST}/seashell/drive/remove`, {
      driveId,
      token
    });
    dispatch({
      type: 'HOST_REMOVE',
      payload: {driveId}
    })
  }catch(e){
    console.log(e.stack)
  }
};

/**
 * 更新location列表
 * @param driveId
 */
export const getLocations = (driveId) => async (dispatch, getState) => {
  try {

    dispatch({
      type: "HOST_STATE_UPDATE",
      payload: {
        locationState: 1
      }
    });

    const {token} = getState().account;
    const hostDetailResult = await await POSTRawJSON(`${API_HOST}/seashell/drive/getMeta`,{
      driveId,
      token
    });

    if (hostDetailResult.error) throw new Error(hostDetailResult.error);
    dispatch({
      type: "HOST_LOCATION_UPDATE",
      payload: {
        driveId,
        locations: hostDetailResult.location.locations
      }
    })

  } catch(e){
    console.log(e.stack)
  }
};


/**
 * 更新locations
 * @param driveId
 * @param locations
 */
export const commitLocations = (driveId, locations) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const response = await POSTRawJSON(`${API_HOST}/seashell/drive/commitLocations`,{
      token,
      driveId,
      locations: locations.map(location => {
        delete location.sort;
        delete location.contentType;
        return location
      })
    });
    if (response.error) throw new Error(response.error);

    dispatch({
      type: "HOST_LOCATION_UPDATE",
      payload: {
        driveId,
        locations
      }
    })

  } catch(e){
    console.log(e.stack);
    alert(e.message)
  }
};

