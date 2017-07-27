
import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'
import signature from './common/signature'

/**
 * 发送验证码
 * @param form
 * @returns {function()}
 */
export default (form) => async (dispatch, getState) => {
  try {
    const {registerVerifyCodeCount} = getState().account;
    if (registerVerifyCodeCount>0) return console.log('count not finish.');

    const result = await POSTUrlencodeJSON(API_HOST, signature({
      action: "createLoginCode",
      reducerName: 'EmailCode',
      email: form.email
    }));
    if (result.error) throw result.error;

    const countdown = (count) => {
      dispatch({
        type: 'UPDATE_REGISTER_VERIFY_CODE_COUNT',
        count: count
      });
      if (count > 0){
        count --;
        setTimeout(()=>{countdown(count)}, 1000)
      }
    };
    countdown(60)
  } catch(error){
    console.log(error.stack||error)
  }
};

