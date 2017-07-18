import Fetch from '@shared/fetch'
import {push} from 'react-router-redux'


export default (formData) => async (dispatch, getState) => {
  const result = await new Fetch(`${global.__SMILE_API}/seashell/account/mutateCreateToken`, {
    email: formData.email,
    code: formData.code
  }).post();

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

