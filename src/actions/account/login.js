import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

const login = (formData) => async (dispatch, getState) => {
  try {
    const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/token/getTokenByEmailCode`, signature({
      email: formData.email,
      code: formData.code
    }));

    if (result.error) throw result.error;
    localStorage.userId = result.userId;
    localStorage.userToken = result.token;
    dispatch({
      type: 'account__loginSuccess',
      payload: {
        token: result.token,
        email: result.email
      }
    })

  } catch(e){
    console.log(e);
    dispatch({
      type: "account__loginError",
      error: e
    })
  }
};

export default module.exports = login