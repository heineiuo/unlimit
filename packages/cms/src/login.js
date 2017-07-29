
import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global


export default (formData) => async (dispatch, getState) => {
  try {
    const result = await Fetch(API_HOST, {
      reducerName: 'Token',
      action: 'getTokenByEmailCode',
      email: formData.email,
      code: formData.code
    }).post();

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

