import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'
import signature from './signature'

/**
 * 检查登录
 * @returns {function()}
 */
const checkLogin = () => async (dispatch, getState) => {
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

    const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/session`, signature({
      token: userToken
    }));

    if (result.error || !result.hasOwnProperty('id')) {
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
        token: userToken,
        profile: result
      },
    })
  } catch(e){
    console.log(e.stack)
  }
};

export default module.exports = checkLogin