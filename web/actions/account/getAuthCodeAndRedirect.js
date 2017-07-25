import Fetch from '@shared/fetch'
import api from '../api'

/**
 * 获取授权码
 * @returns {function()}
 */
const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  const {userToken=null} = localStorage;
  const {redirectUrl} = getState().account;
  const res = await new Fetch(api.mutateCreateAuthCode, {
    token: userToken
  }).post();

  if (res.error) return console.log(res.error);
  location.href = `${redirectUrl}?code=${res.code}`

};

export default module.exports = getAuthCodeAndRedirect
