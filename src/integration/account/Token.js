/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../spruce'
import crypto from 'crypto'
import Email from './Email'
import EmailCode from './EmailCode'
import SSOCode from './SSOCode'

/**
 * 生成超时时间 * 分钟
 * @param minute
 * @returns {number}
 */
export const createExpire = (minute=5) => Date.now()+ 60000 * minute;

const normalToken = () => crypto.randomBytes(48).toString('hex');

const Token = new Model('Token', {});

/**
 * 创建token
 */
Token._createToken = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newToken = normalToken();
      const value = {token: newToken, userId};
      await Token.put(newToken, value);
      resolve(value)
    } catch(e){
      reject(e)
    }
  })
};

/**
 * @api {POST} /account/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
Token.statics.getTokenByEmailCode = (query, ctx) => new Promise(async(resolve, reject) => {
  try {
    const {code, email} = query;
    await EmailCode._checkCode(email, code);
    const userId = await Email._getUserIdWithUpset(email);
    const token = await Token._createToken(userId);
    resolve(token)

  } catch(e) {
    reject(e)
  }

});

/**
 * @api {POST} /account/token/gettokenbyssocode 根据ssocode获取token
 * @apiName TokenBySSOCode
 * @apiGroup Account
 * @apiParam {string} code code
 * @apiSuccess {string} token token
 */
Token.statics.getTokenBySSOCode = (query, ctx) => new Promise(async(resolve, reject) => {
  try {
    const result = await SSOCode.get(query.code);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
});

/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
Token.statics.logout = (query, ctx) => new Promise(async (resolve, reject) => {
  try {
    if (ctx.res.session.user) {
      await Token.del(query.token)
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = Token
