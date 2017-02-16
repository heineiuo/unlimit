import { handleActions } from 'redux-actions'
import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {ORIGIN_HOST} from '../constants'
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

  HOST_DEFAULT_UPDATE (state, action) {

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

  HOST_LOCATION_SORT_UPDATE (state, action) {

  },

  HOST_LOCATION_REMOVE (state, action) {

  }
}, initialState)



/**
 * 渲染我的app列表
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
    const hostListResult = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`,{
      reducerName: 'host', action: 'list',limit: 0, token
    });

    if (hostListResult.error) throw new Error(hostListResult.error);

    if (hostListResult.list.length == 0) {
      // todo
      throw new Error('空间数量为零！')

    } else {
      const hostDefault = hostListResult.list[0].hostname;

      if (currentHostname) {
        const currentHostnameIndex = hostListResult.list.findIndex(item => item.hostname == currentHostname);
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
    const data = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      reducerName: 'host', action: 'New',
      hostname: form.hostname
    });
    if (data.error) throw new Error(data.error);
    dispatch({
      type: 'HOST_ADD',
      payload: {
        hostname: form.hostname
      }
    });

    dispatch(push(`/${form.hostname}`))
  } catch(e){
    console.log(`${e}${JSON.stringify(e.stack||{})}`)
  }
};



/**
 * 删除host
 * @returns {function()}
 */
export const deleteHost = (hostname) => async (dispatch, getState) =>{
  try {
    const {token} = getState().account;
    await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      reducerName: 'host', action: 'Delete',hostname, token
    });
    dispatch({
      type: 'HOST_REMOVE',
      payload: {hostname}
    })
  }catch(e){
    console.log(e.stack)
  }
};


export const switchHost = (hostname) => ({
  type: 'HOST_SWITCH',
  payload: {hostname}
});


export const getLocation = (hostname) => async (dispatch, getState) => {
  try {

    dispatch({
      type: "HOST_STATE_UPDATE",
      payload: {
        locationState: 1
      }
    });

    const {token} = getState().account;
    const hostDetailResult = await await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`,{
      reducerName: 'location', action: 'list', hostname, token
    });

    if (hostDetailResult.error) throw new Error(hostDetailResult.error);
    dispatch({
      type: "HOST_LOCATION_UPDATE",
      payload: {
        hostname,
        locations: hostDetailResult.location.locations
      }
    })

  } catch(e){
    console.log(e.stack)
  }
};

/**
 * 排序,设置优先级
 * @returns {function()}
 */
export const editLocationSort = (hostname, location, arrow) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const {sort, pathname} = location;
    const nextSort = sort + (arrow=='up'?-1:1);
    if (nextSort < 1) return false;
    const response = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`,{
      reducerName: 'Location', action: 'UpdateSort', token, hostname, pathname, nextSort});
    if (response.error) throw new Error(response.error);

    // 直接获取一下新的列表
    const data = await POSTRawJSON(`${ORIGIN_HOST}/api/gateway`, {
      reducerName: 'location', action: 'list', token, hostname
    });
    if (data.error) throw data.error;
    dispatch({
      type: "HOST_LOCATION_UPDATE",
      payload: {
        hostname,
        locations: data.location.locations
      }
    })
  } catch(e){
    console.log(e.stack);
    alert(e.message)
  }
};


/**
 * 新建路由
 * @param hostname
 * @param nextLocation
 * @returns {function()}
 */
export const createLocation = (hostname, nextLocation) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const {pathname, cors, type, contentType, content} = nextLocation;
    const response = await POSTRawJSON( `${ORIGIN_HOST}/api/gateway`, {
      reducerName: 'location', action: 'New',
      token, hostname, pathname, cors, type, contentType, content
    });
    if (response.error) throw new Error(response.error);
    dispatch({
      type: 'HOST_LOCATION_ADD',
      payload: {
        nextLocation: nextLocation
      }
    })
  } catch (e) {
    console.log(e)
  }
};

/**
 * 编辑路由
 * @param hostname
 * @param nextLocation
 * @returns {function()}
 */
export const editLocation = (hostname, nextLocation) => async(dispatch, getState) => {
  try {
    const {token} = getState().account;
    const {pathname, cors, type, contentType='text', content} = nextLocation;
    const response = await POSTRawJSON( `${ORIGIN_HOST}/api/gateway`, {
      reducerName: 'location', action: 'edit',
      token,
      hostname,
      pathname,
      cors,
      type,
      contentType,
      content
    });

    if (response.error) throw new Error(response.error);
    dispatch({
      type: 'HOST_LOCATION_EDIT',
      payload: {
        nextLocation: nextLocation
      }
    })
  } catch(e){
    console.log(e)
  }
};