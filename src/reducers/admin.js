import {handleActions} from 'redux-actions'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'
import {POSTUrlencodeJSON} from 'fetch-tools'

const initialState = {
  userListState: 0,
  userList: []
};

export default handleActions({

  ADMIN_USER_LIST_STATE_UPDATE (state, action) {
    return Object.assign({}, state, {
      userListState: action.payload.userListState
    })
  },
  ADMIN_USER_LIST_UPDATE (state, action) {
    return Object.assign({}, state, {
      userListState: 2,
      userList: action.payload.userList
    })
  },

}, initialState)


export const fetchUserList = (formData) => async (dispatch, getState) => {
  try {

    dispatch({
      type: 'ADMIN_USER_LIST_STATE_UPDATE',
      payload: {
        userListState: 1,
      }
    });
    const {token} = getState().account;
    console.log(getState());
    const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/user/list`, {
      token,
      ...formData
    });

    if (result.error) throw result.error;

    dispatch({
      type: 'ADMIN_USER_LIST_UPDATE',
      payload: {
        userList: result.list
      }
    });

  } catch(e){

    console.error(e);
    dispatch({
      type: 'ADMIN_USER_LIST_STATE_UPDATE',
      payload: {
        userListState: 3,
      }
    });
  }
};