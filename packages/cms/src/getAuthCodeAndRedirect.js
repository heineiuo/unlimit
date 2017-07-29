
import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global


/**
 * 获取授权码
 * @returns {function()}
 */
export default () => async (dispatch, getState) => {
  try {
    const {userToken=null} = localStorage;
    const {redirectUrl} = getState().account;
    const res = await Fetch(API_HOST, {
      action: 'getTokenBySSOCode',
      reducerName: 'token',
      token: userToken
    }).post();
    if (res.error) return console.log(res.error);
    location.href = `${redirectUrl}?code=${res.code}`
  } catch(e){
    console.log(e.stack||e)
  }
};

