
import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'

import signature from './common/signature'

/**
 * 检查登录
 * @returns {function()}
 */
export default () => async (dispatch, getState) => {
  try {
    const userToken = localStorage.userToken || null;
    if (!userToken) {
      return dispatch({
        type: "CHECKED_LOGIN",
        payload: {
          logged: false
        }
      })
    }

    const result = await POSTUrlencodeJSON(API_HOST, signature({
      reducerName: 'token',
      action: 'session',
      token: userToken
    }));

    if (result.error || result.user === null) {
      return dispatch({
        type: 'CHECKED_LOGIN',
        payload: {
          logged: false
        }
      })
    }

    dispatch({
      type: 'CHECKED_LOGIN',
      payload: {
        logged: true,
        email: result.email,
        profile: result
      },
    })
  } catch(e){
    console.log(e.stack)
  }
};

