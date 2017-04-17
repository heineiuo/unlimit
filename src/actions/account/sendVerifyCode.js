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
  const {registerVerifyCodeCount} = getState().account;
  if (registerVerifyCodeCount > 0) return console.log('count not finish.');
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

  const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/createVerificationCode`, signature({
    email: form.email
  }));

  if (result.error) return console.log(result.error);
  countdown(60)
};

export default module.exports = sendVerifyCode