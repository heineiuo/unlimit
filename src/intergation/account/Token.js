/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../utils/spruce'
import crypto from 'crypto'
import Email from './Email'
import EmailCode from './EmailCode'
import SSOCode from './SSOCode'

/**
 * 生成超时时间 * 分钟
 * @param minute
 * @returns {number}
 */
export const createExpire = function(minute=5){
  return Date.now()+ 60000 * minute
};

const normalToken = () => crypto.randomBytes(48).toString('hex');

const Token = new Model('Token', {});

/**
 * 创建token
 */
Token.createToken = (userId) => {
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

Token.statics.getTokenByEmailCode = (query, ctx) => new Promise(async(resolve, reject) => {
  try {
    const {code, email} = query;
    await EmailCode.checkCode(email, code);
    const userId = await Email.getUserIdWithUpsert(email);
    const token = await Token.createToken(userId);
    resolve(token)

  } catch(e) {
    reject(e)
  }

});

Token.statics.getTokenBySSOCode = (query, ctx) => new Promise(async(resolve, reject) => {
  try {
    const result = await SSOCode.get(query.code);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
})

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

export default Token
