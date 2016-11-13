/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../utils/spruce'
import crypto from 'crypto'

const normalCode = () => {
  return crypto.randomBytes(32).toString('hex')
}

const SSOCode = new Model('SSOCode', {});

SSOCode.createCode = (token) => {
  return new Promise(async(resolve, reject) => {
    try {
      const code = normalCode();
      await SSOCode.put(code, {token, code});
      resolve(code)
    } catch(e){
      reject(e)
    }
  })
};

SSOCode.statics.get = (query, ctx) => new Promise(async (resolve, reject) => {
  if (!ctx.res.session.user) reject('ERR_NOT_LOGGED');
  const code = await SSOCode.createCode(ctx.req.body.token);
  resolve({code})
});

export default SSOCode
