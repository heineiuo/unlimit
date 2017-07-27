
import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../constants'

import signature from './common/signature'


export default (formData) => async (dispatch, getState) => {
  try {
    const result = await POSTUrlencodeJSON(API_HOST, signature({
      reducerName: 'Token',
      action: 'getTokenByEmailCode',
      email: formData.email,
      code: formData.code
    }));

    if (result.error) throw result.error;
    localStorage.userId = result.userId;
    localStorage.userToken = result.token;
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        email: result.email
      }
    })

  } catch(e){
    console.log(e);
    dispatch({
      type: "LOGIN_ERROR",
      error: e
    })
  }
};

