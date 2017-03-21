
import crypto from 'crypto'

/**
 * 生成超时时间 * 分钟
 * @param minute
 * @returns {number}
 */
export const createExpire = (minute=5) => Date.now()+ 60000 * minute;

const normalToken = () => crypto.randomBytes(48).toString('hex');


/**
 * 创建token
 */
const createToken = ({userId}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.token;
    const newToken = normalToken();
    const value = {token: newToken, userId};
    await db.put(newToken, value);
    resolve(value)
  } catch(e){
    reject(e)
  }
});

export default module.exports = createToken