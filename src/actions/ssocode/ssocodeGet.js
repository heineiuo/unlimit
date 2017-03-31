import createCode from './createCode'

/**
 * @api {POST} /account2/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
const ssocodeGet = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const {token} = query;
  if (!getCtx().res.session.user) reject(new Error('ERR_NOT_LOGGED'));
  const code = await dispatch(createCode)({token});
  resolve({code})
});

export default module.exports = ssocodeGet