import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

const logout = () => async (dispatch, getState) => {
  console.log('正在登出系统...');
  const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/logout`, signature({
    token: localStorage.userToken
  }));

  if (result.error) return console.log(result.error);
  localStorage.clear();
  dispatch({
    type: 'account__logout'
  });
  dispatch(push('/'));
};

export default module.exports = logout;