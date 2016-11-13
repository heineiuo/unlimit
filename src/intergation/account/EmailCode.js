/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../utils/spruce'



/**
 * 生成数字验证码
 * @param length 验证码长度
 */
export const createNumberCode = function(length=6){
  const fill0 = (str) => str.length == length?str:fill0(`${str}0`);
  return fill0(String(Math.random()).substr(2, length));
}


const EmailCode = new Model('EmailCode', {})

/**
 * 登录验证码
 * @param email
 */
EmailCode.createLoginCode = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(email)
      const code = createNumberCode()
      await EmailCode.put(email, {code, createTime: Date.now()})
      resolve(code)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 检查code
 */
EmailCode.checkCode = (email, code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await EmailCode.get(email)
      if (result.code != code) return reject('ILLEGAL_CODE')
      if (result.createTime + 6000 * 3 > Date.now()) return reject('EXPIRE_CODE')
      await EmailCode.del(email)
      resolve(true)
    } catch(e){
      if (e.name == 'NotFoundError') return reject('ILLEGAL_CODE')
      reject(e)
    }
  })
}

export default EmailCode
