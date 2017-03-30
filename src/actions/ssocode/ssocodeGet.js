import {connect, bindActionCreators} from 'action-creator'
import createCode from './createCode'

/**
 * @api {POST} /account2/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
const ssocodeGet = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  const {token} = query;
  const {createCode} = getAction();
  if (!ctx.res.session.user) reject(new Error('ERR_NOT_LOGGED'));
  const code = await createCode({token});
  resolve({code})
});

export default module.exports = connect(bindActionCreators({
  createCode
}))(ssocodeGet)
