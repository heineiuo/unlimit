import { handleActions } from 'redux-actions'
import { injectAsyncReducer } from '@react-web/store'
import Fetch from '@shared/fetch'
const {API_HOST} = global
import {push} from 'react-router-redux'


const initialState = {
  currentDriveId: '',
  currentDriveName: '',

  driveUserState: 0, // 0 not init, 1 querying 2 ready 3 mutating
  driveUserError: '',
  adminId: '',
  driveUserAdmin: {},
  driveUserList: [],
  domains: [],

  hostList: [],
  hostListState: 0, // 0=not init, 1=loading, 2=ready

  locationState: 0, // 0=not init, 1=loading, 2=ready
  locations: {},
};

injectAsyncReducer('drive', handleActions({
  host__stateUpdate (state, action) {
    return Object.assign({}, state, action.payload)
  },

  host__hostListUpdate (state, action) {
    return Object.assign({}, state, action.payload, {
      hostListState: 2,
    })
  },

  host__metaUpdate (state, action) {
    const {payload: {driveId, domains, name, locations, adminId}} = action;
    return Object.assign({}, state, {
      currentDriveId: driveId,
      currentDriveName: name,
      locations,
      locationState: 2,
      adminId,
      domains,
    })
  },

  host__add (state, action) {
    const {name, _id, description=''} = action.payload;
    const nextHostList = state.hostList.concat({
      name, _id, description
    });
    return Object.assign({}, state, {hostList: nextHostList})
  },

  host__remove (state, action) {
    const nextHostList = state.hostList.filter(item => {
      return item.hostname !== action.payload.hostname
    });
    return Object.assign({}, state, {hostList: nextHostList})
  },

  host__locationUpdate (state, action) {
    return Object.assign({}, state, action.payload, {
      locationState: 2
    })
  },

  host__driveUserUpdate (state, action) {
    const {driveUserState, driveUserError='', driveUserList, driveUserAdmin} = action.payload;
    return Object.assign({}, state, {driveUserState, driveUserError},
      driveUserList ? {driveUserList} : {},
      driveUserAdmin ? {driveUserAdmin} : {}
    )
  },

}, initialState))


/**
 * 删除host
 * @returns {function()}
 */
export const mutateDeleteOne = (driveId) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const result = await new Fetch(`${API_HOST}/seashell/drive/remove`, {
    driveId,
    token
  }).post();

  if (result.error) return console.log(result.error)

  dispatch({
    type: 'host__remove',
    payload: {driveId}
  })

};

/**
 * 添加host
 */
export const mutateInsertOne = (query) => async (dispatch, getState) => {
  const {name, description} = query;
  const {account: {token}} = getState();
  const result = await new Fetch(`${API_HOST}/seashell/drive/mutateInsertOne`, {
    token,
    name,
    description,
  }).post();
  if (result.error) return alert(result.error);

  dispatch({
    type: 'host__add',
    payload: {
      name: query.name
    }
  });

  dispatch(push(`/drive/${result._id}`))
};


/**
 * 更新locations
 * @param driveId
 * @param locations
 */
export const mutateLocations = (driveId, locations) => async(dispatch, getState) => {
  const {token} = getState().account;
  const result = await new Fetch(`${API_HOST}/seashell/drive/mutateLocation`,{
    token,
    driveId,
    locations: locations.map(location => {
      delete location.sort;
      delete location.contentType;
      return location
    })
  }).post();

  if (result.error) return console.log(result.error);
  dispatch({
    type: "host__locationUpdate",
    payload: {
      driveId,
      locations
    }
  })
};



export const mutateUsers = (query) => async (dispatch, getState) => {

  const {add=[], remove=[], driveId} = query;
  const {account: {token}, host: {driveUserList}} = getState();
  const backup = driveUserList.slice();

  const handleError = (e) => {
    alert(e)
    dispatch({
      type: 'host__driveUserUpdate',
      payload: {
        driveUserState: 2,
        driveUserList: backup
      }
    })
  }

  let nextDriveUserList = driveUserList.slice()
    .filter(item => remove.findIndex(r => r.id === item.id) === -1)
    .concat(add)

  dispatch({
    type: "host__driveUserUpdate",
    payload: {
      driveUserState: 3,
      driveUserList: nextDriveUserList
    }
  })

  const result = await new Fetch(`${API_HOST}/seashell/drive/mutateUser`, {
    token, driveId,
    add: add.map(item => item.id),
    remove: remove.map(item => item.id),
  }).post();

  if (result.error) return handleError(result.error)

  dispatch({
    type: "host__driveUserUpdate",
    payload: {
      driveUserState: 2,
    }
  })
}



/**
 * 更新我的app列表
 */
export const queryList = () => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const handleError = (e) => console.error(e);

  dispatch({
    type: 'host__stateUpdate',
    payload: {
      hostListState: 1,
    }
  });

  const result = await new Fetch(`${API_HOST}/seashell/drive/queryMeta`, {
    limit: 0, token, fields: ['name']
  }).post();

  if (result.error) return handleError(result.error);
  dispatch({
    type: "host__hostListUpdate",
    payload: {
      hostList: result.data,
    }
  });
};


export const queryOne =  (driveId) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const result = await await new Fetch(`${API_HOST}/seashell/drive/queryOne`, {
    driveId,
    token,
    fields: ['domains', 'locations', 'name', 'adminId']
  }).post();

  if (result.error) throw new Error(result.error);
  const {domains, locations, name, adminId} = result;
  dispatch({
    type: "host__metaUpdate",
    payload: {
      driveId, domains, locations, name, adminId
    }
  })
};


export const queryUserList = (query) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const {driveId} = query;
  const result = await new Fetch(`${API_HOST}/seashell/drive/queryUsers`, {
    token, driveId
  }).post();
  if (result.error) return console.log(result.error);

  dispatch({
    type: 'host__driveUserUpdate',
    payload: {
      driveUserState: 2,
      driveUserList: result.data,
    }
  })
}
