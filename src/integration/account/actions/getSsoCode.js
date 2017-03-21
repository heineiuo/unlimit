
import {
  connect, bindActionCreators
} from '../../tools'

import createCode from './createCode'

/**
 * @api {POST} /account/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
const Get = (token) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  const {createCode} = getAction();
  if (!ctx.res.session.user) reject(new Error('ERR_NOT_LOGGED'));
  const code = await createCode({token});
  resolve({code})
});

export default connect(bindActionCreators({
  createCode
}))(Get)