import Fetch from '@shared/fetch'
const {API_HOST} = global
import {push} from 'react-router-redux'
import { match, when } from 'match-when'

const defaultState = {
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

export default (state=defaultState, action) => {
  return match(action.type, {
    [when('@@host/STATE_UPDATE')]: () => 
      Object.assign({}, state, action.payload),

    [when('@@host/LIST_UPDATE')]: () => 
      Object.assign({}, state, action.payload, {
        hostListState: 2,
      }),

    [when('@@host/META_UPDATE')]: () => {
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
    
    [when('@@host/ADD')]: () => {
      const {name, _id, description=''} = action.payload;
      const nextHostList = state.hostList.concat({
        name, _id, description
      });
      return Object.assign({}, state, {hostList: nextHostList})
    },

    [when('@@host/REMOVE')]: () => {
      const nextHostList = state.hostList.filter(item => {
        return item.hostname !== action.payload.hostname
      });
      return Object.assign({}, state, {hostList: nextHostList})
    },

    [when('@@host/LOCATION_UPDATE')]: () => {
      return Object.assign({}, state, action.payload, {
        locationState: 2
      })
    },

    [when('@@host/DRIVE_USER_UPDATE')]: () => {
      const {driveUserState, driveUserError='', driveUserList, driveUserAdmin} = action.payload;
      return Object.assign({}, state, {driveUserState, driveUserError},
        driveUserList ? {driveUserList} : {},
        driveUserAdmin ? {driveUserAdmin} : {}
      )
    },

    [when()]: state
  })
}


/**
 * 删除host
 * @returns {function()}
 */
export const mutateDeleteOne = (driveId) => async (dispatch, getState) => {
  const {account: {token}} = getState();
  const result = await api.driveRemove({
    driveId,
    token
  })

  if (result.error) return console.log(result.error)

  dispatch({
    type: '@@host/REMOVE',
    payload: { driveId }
  })

};

/**
 * 添加host
 */
export const mutateInsertOne = (query) => async (dispatch, getState) => {
  const {name, description} = query;
  const {account: {token}} = getState();
  const result = await api.driveInsertOne({
    token,
    name,
    description,
  })
  if (result.error) return alert(result.error);

  dispatch({
    type: '@@host/ADD',
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
  const result = await api.driveMudateLocation({
    token,
    driveId,
    locations: locations.map(location => {
      delete location.sort;
      delete location.contentType;
      return location
    })
  })

  if (result.error) return console.log(result.error);
  dispatch({
    type: "@@host/LOCATION_UPDATE",
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
      type: '@@host/DRIVE_USER_UPDATE',
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
    type: "@@host/DRIVE_USER_UPDATE",
    payload: {
      driveUserState: 3,
      driveUserList: nextDriveUserList
    }
  })

  const result = await api.driveMutateUser({
    token, driveId,
    add: add.map(item => item.id),
    remove: remove.map(item => item.id),
  })

  if (result.error) return handleError(result.error)

  dispatch({
    type: "@@host/DRIVE_USER_UPDATE",
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
    type: '@@host/STATE_UPDATE',
    payload: {
      hostListState: 1,
    }
  });

  const result = await api.driveMeta({
    limit: 0, token, fields: ['name']
  })

  if (result.error) return handleError(result.error);
  dispatch({
    type: "@@host/LIST_UPDATE",
    payload: {
      hostList: result.data,
    }
  });
};


export const queryOne =  (driveId) => async (dispatch, getState) => {

  const {account: {token}} = getState();
  const result = await api.driveQueryOne({
    driveId,
    token,
    fields: ['domains', 'locations', 'name', 'adminId']
  })

  if (result.error) throw new Error(result.error);
  const {domains, locations, name, adminId} = result;
  dispatch({
    type: "@@host/META_UPDATE",
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
    type: '@@host/DRIVE_USER_UPDATE',
    payload: {
      driveUserState: 2,
      driveUserList: result.data,
    }
  })
}
