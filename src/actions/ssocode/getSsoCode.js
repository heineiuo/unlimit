
import createCode from './createCode'

/**
 * @api {POST} /account2/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
const Get = (token) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  if (!getCtx().request.headers.session) reject(new Error('ERR_NOT_LOGGED'));
  const code = await dispatch(createCode)({token});
  resolve({code})
});

export default module.exports = Get