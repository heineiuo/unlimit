import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'
const {API_HOST} = global

const logout = () => async (dispatch, getState) => {
  console.log('正在登出系统...');
  const result = await new Fetch(`${API_HOST}/seashell/account/mutateDeleteToken`, {
    token: localStorage.userToken
  });

  if (result.error) return console.log(result.error);
  localStorage.clear();
  dispatch({
    type: 'account__logout'
  });
  dispatch(push('/'));
};

export default module.exports = logout;
