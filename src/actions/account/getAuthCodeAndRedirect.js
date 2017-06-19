import Fetch from '@shared/fetch'
const {API_HOST} = global

/**
 * 获取授权码
 * @returns {function()}
 */
const getAuthCodeAndRedirect = () => async (dispatch, getState) => {
  const {userToken=null} = localStorage;
  const {redirectUrl} = getState().account;
  const res = await new Fetch(`${API_HOST}/seashell/account/mutateCreateAuthCode`, {
    token: userToken
  }).post();

  if (res.error) return console.log(res.error);
  location.href = `${redirectUrl}?code=${res.code}`

};

export default module.exports = getAuthCodeAndRedirect
