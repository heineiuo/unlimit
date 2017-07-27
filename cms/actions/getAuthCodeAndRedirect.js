
import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'

import signature from './common/signature'

/**
 * 获取授权码
 * @returns {function()}
 */
export default () => async (dispatch, getState) => {
  try {
    const {userToken=null} = localStorage;
    const {redirectUrl} = getState().account;
    const res = await POSTUrlencodeJSON(API_HOST, signature({
      action: 'getTokenBySSOCode',
      reducerName: 'token',
      token: userToken
    }));
    if (res.error) return console.log(res.error);
    location.href = `${redirectUrl}?code=${res.code}`
  } catch(e){
    console.log(e.stack||e)
  }
};

