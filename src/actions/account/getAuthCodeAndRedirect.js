import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

/**
 * 获取授权码
 * @returns {function()}
 */
const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  const {userToken=null} = localStorage;
  const {redirectUrl} = getState().account;
  const res = await POSTRawJSON(`${API_HOST}/seashell/account/mutateCreateAuthCode`, signature({
    token: userToken
  }));

  if (res.error) return console.log(res.error);
  location.href = `${redirectUrl}?code=${res.code}`

};

export default module.exports = getAuthCodeAndRedirect