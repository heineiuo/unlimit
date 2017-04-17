import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

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

  const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/session`, signature({
    token: userToken
  }));

  if (result.error || !result.hasOwnProperty('id')) {
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