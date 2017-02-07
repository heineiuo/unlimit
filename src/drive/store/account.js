import { handleActions } from 'redux-actions'

import {POSTUrlencodeJSON} from 'fetch-tools'
import {API_HOST, signature} from '../constants'

const initialState = {
  loginChecked: false,
  logged: false,
  token: null,
  loginError: null
};

export default handleActions({

  ACCOUNT_LOGIN_CHECKED (state, action) {
    return Object.assign({}, state, action.payload, {loginChecked: true})
  },

  ACCOUNT_LOGOUT (state, action) {
    return Object.assign({}, state, {
      logged: false
    })
  },

  ACCOUNT_LOGIN_SUCCESS (state, action){
    return Object.assign({}, state, {
      logged: true,
      loginError: null
    })
  },

  ACCOUNT_LOGIN_FAIL (state, action) {
    return Object.assign({}, state, {
      loginError: action.loginError
    })
  }

}, initialState)


export const checkLogin = () =>  async (dispatch, getState) => {
  try {
    const {userToken} = localStorage;
    if (!userToken) {
      return dispatch({
        type: "ACCOUNT_LOGIN_CHECKED",
        payload: {
          logged: false
        }
      })
    }

    const session = await POSTUrlencodeJSON(`${API_HOST}/api/account`, signature({
      reducerName: 'token', action: 'session',
      token: userToken
    }));

    if (session.error) throw session.error;
    dispatch({
      type: "ACCOUNT_LOGIN_CHECKED",
      payload: {
        logged: true,
        token: userToken
      }
    })
  } catch(e){
    dispatch({
      type: "ACCOUNT_LOGIN_CHECKED",
      payload: {
        logged: false
      }
    });

    alert(e)
  }

};