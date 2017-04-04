import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST } from '../../constants'
import signature from '../common/signature'

/**
 * 发送验证码
 * @param form
 * @returns {function()}
 */
const sendVerifyCode = (form) => async (dispatch, getState) => {
  try {
    const {registerVerifyCodeCount} = getState().account;
    if (registerVerifyCodeCount>0) return console.log('count not finish.');

    const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/emailcode/createLoginCode`, signature({
      email: form.email
    }));
    if (result.error) throw result.error;

    const countdown = (count) => {
      dispatch({
        type: 'account__updateRegisterVerifyCodeCount',
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

export default module.exports = sendVerifyCode