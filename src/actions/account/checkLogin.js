import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'

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

  const result = await new Fetch(`${global.__SMILE_API}/seashell/account/session`, {
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
