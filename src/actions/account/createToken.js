/**
 * @private
 */

import crypto from 'crypto'

const normalToken = () => crypto.randomBytes(48).toString('hex');


/**
 * 生成超时时间 * 分钟
 * @param minute
 * @returns {number}
 */
export const createExpire = (minute=5) => Date.now()+ 60000 * minute;

export default ({userId}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('token');
    const nextToken = {token: normalToken(), userId};
    await db.put(nextToken.token, nextToken);
    resolve(nextToken)
  } catch(e){
    reject(e)
  }
});

