
import {
  connect, bindActionCreators
} from '../../utils/tools'

import createCode from './createCode'

/**
 * @api {POST} /account2/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
const Get = (token) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  const {createCode} = getAction();
  if (!ctx.request.headers.session) reject(new Error('ERR_NOT_LOGGED'));
  const code = await createCode({token});
  resolve({code})
});

export default module.exports = connect(bindActionCreators({
  createCode
}))(Get)