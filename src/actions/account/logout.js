import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

const logout = () => async (dispatch, getState) => {
  console.log('正在登出系统...');
  let result = null;
  try {
    result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/logout`, signature({
      token: localStorage.userToken
    }));
  } catch (e) {
    return console.log(e.stack || e)
  }

  if (result.error) throw result.error;
  localStorage.clear();
  dispatch({
    type: 'account__logout'
  });
  dispatch(push('/'));

};

export default module.exports = logout;