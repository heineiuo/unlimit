import {POSTUrlencodeJSON} from 'fetch-tools'
import {push} from 'react-router-redux'
import {API_HOST} from '../../constants'
import signature from '../common/signature'

const login = (formData) => async (dispatch, getState) => {
  const result = await POSTUrlencodeJSON(`${API_HOST}/seashell/account/mutateCreateToken`, signature({
    email: formData.email,
    code: formData.code
  }));

  if (result.error) {
    console.log(result.error);
    return dispatch({
      type: "account__loginError",
      error: result.error
    })
  }
  localStorage.userId = result.userId;
  localStorage.userToken = result.token;
  dispatch({
    type: 'account__loginSuccess',
    payload: {
      token: result.token,
      email: result.email
    }
  })
};

export default module.exports = login