import { handleActions } from 'redux-actions'

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

export default handleActions({
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

}, initialState)