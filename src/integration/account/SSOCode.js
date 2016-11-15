/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../spruce'
import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

const SSOCode = new Model('SSOCode', {});

/**
 *
 * @param token
 * @returns {Promise}
 */
SSOCode._createCode = (token) => new Promise(async(resolve, reject) => {
  try {
    const code = normalCode();
    await SSOCode.put(code, {token, code});
    resolve(code)
  } catch(e){
    reject(e)
  }
});

/**
 * @api {POST} /account/ssocode/get 获取ssocode
 * @apiName SSOCodeGet
 * @apiGroup Account
 * @apiParam {string} token
 * @apiSuccess {string} code
 */
SSOCode.statics.get = (query, ctx) => new Promise(async (resolve, reject) => {
  const {token} = query;
  if (!ctx.res.session.user) reject('ERR_NOT_LOGGED');
  const code = await SSOCode._createCode(token);
  resolve({code})
});

export default module.exports = SSOCode
