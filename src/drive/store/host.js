import { handleActions } from 'redux-actions'
import defaults from 'lodash.defaults'
import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../constants'
import {push} from 'react-router-redux'

const initialState = {
  hostList: [],
  locationList: [],

  hostname: '',
  host: {},
  location: {},

  // 正在加载详情
  loadingHostDetail: true,

  loadingLocationList: true
};

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

/**
 * 添加host
 */
export const createHost = (opts) => async (dispatch, getState) => {
  try {
    const data = await POSTRawJSON(`${API_HOST}/api/gateway/Host/new`,{hostname: opts.hostname});
    if (data.error) throw new Error(data.error);
    dispatch(push(`/host/${opts.hostname}/location`))
  } catch(e){
    console.log(`${e}${JSON.stringify(e.stack||{})}`)
  }
};


/**
 * 渲染我的app列表
 */
export const getHostList = (page=1) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;
    const data = await POSTRawJSON(`${API_HOST}/api/gateway/host/list`,{limit: 0, token});
    const list = data.list;
    dispatch({
      type: "HOST_LIST_UPDATE",
      hostList: list
    })
  } catch(e){
    console.log(e)
  }
};


/**
 * 删除host
 * @returns {function()}
 */
export const deleteHost = (hostname) => async (dispatch, getState) =>{
  try {
    const {token} = getState().account;
    await POSTRawJSON(`${API_HOST}/api/gateway/Host/delete`, {hostname, token})
  }catch(e){
    console.log(e)
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
    const response = await POSTRawJSON(`${API_HOST}/api/gateway/location/updatesort`,{token, hostname, pathname, nextSort});
    if (response.error) throw response.error;
    const data = await POSTRawJSON(`${API_HOST}/api/gateway/location/list`, {token, hostname});
    if (data.error) throw data.error;
    console.log(data.location.locations);
    dispatch({
      type: "UPDATE_LOCATION_LIST",
      host: data.host,
      hostname: hostname,
      locationList: data.location.locations
    })
  } catch(e){
    console.log(e);
    alert(e)
  }
};


/**
 * 获取location列表
 * @returns {function()}
 */
export const getHostLocationList = (hostname) => async (dispatch, getState)=>{
  try {
    const {token} = getState().account;
    const data = await POSTRawJSON(`${API_HOST}/api/gateway/location/list`, {hostname, token});
    if (data.error) throw data.error;
    dispatch({
      type: "UPDATE_LOCATION_LIST",
      host: data.host,
      hostname: hostname,
      locationList: data.location.locations
    })
  } catch(e) {
    console.log(e)
  }
};



/**
 * 获取路由配置详情
 */
export const getRouterDetail =(hostname, pathname, callback) => async (dispatch, getState) => {
  try {
    const {token} = getState().account;
    const data = await POSTRawJSON(`${API_HOST}/location/list`, {hostname, token});
    dispatch({
      type: 'UPDATE_LOCATION_DETAIL',
      hostname: data.host.hostname,
      location: data.location.locations[pathname]
    });
    callback(data.location.locations[pathname])
  } catch(e){
    console.log(e)
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
    const response = await POSTRawJSON( `${API_HOST}/api/gateway/location/new`, {
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
      type: 'UPDATE_LOCATION',
      nextLocation: nextLocation
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
    const response = await POSTRawJSON( `${API_HOST}/api/gateway/Location/edit`, {
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
      type: 'UPDATE_LOCATION',
      nextLocation: nextLocation
    })
  } catch(e){
    console.log(e)
  }
};