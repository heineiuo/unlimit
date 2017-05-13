import Fetch from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'

/**
 * 检查登录
 * @returns {function()}
 */
const checkLogin = () => async (dispatch, getState) => {
  const userToken = localStorage.userToken || null;
  if (!userToken) {
    return dispatch({
      type: "account__checkedLogin",
      payload: {
        logged: false
      }
    })
  }

  const result = await new Fetch(`${API_HOST}/seashell/account/session`, {
    token: userToken
  }).post();

  if (result.error || !result.hasOwnProperty('userId')) {
    return dispatch({
      type: 'account__checkedLogin',
      payload: {
        logged: false
      }
    })
  }

  dispatch({
    type: 'account__checkedLogin',
    payload: {
      logged: true,
      email: result.email,
      token: userToken,
      profile: result
    },
  })
};

export default module.exports = checkLogin
