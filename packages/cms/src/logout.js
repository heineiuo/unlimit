
import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global



const logout = () => async (dispatch, getState) => {
  try {
    console.log('正在登出系统...');
    const result = await new Fetch(API_HOST, {
      reducerName: 'Token',
      action: 'logout',
      token: localStorage.userToken
    }).post();
    if (result.error) throw result.error;
    localStorage.clear();
    dispatch({
      type: 'ACCOUNT_LOGOUT'
    });
    dispatch(push('/'));
  } catch (e) {
    console.log(e.stack || e)
  }
};

export default logout
