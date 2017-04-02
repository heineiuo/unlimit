import {GETJSON, POSTRawJSON, Mock, Urlencode} from 'fetch-tools'
import {API_HOST} from '../constants'
import signature from './signature'

/**
 * 获取授权码
 * @returns {function()}
 */
const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  try {
    const {userToken=null} = localStorage;
    const {redirectUrl} = getState().account;
    const res = await POSTRawJSON(`${API_HOST}/seashell/ssocode/getTokenBySSOCode`, signature({
      token: userToken
    }));
    if (res.error) return console.log(res.error);
    location.href = `${redirectUrl}?code=${res.code}`
  } catch(e){
    console.log(e.stack||e)
  }
};

export default module.exports = getAuthCodeAndRedirect