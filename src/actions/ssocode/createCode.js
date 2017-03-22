import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

/**
 *
 * @param token
 * @returns {Promise}
 */
const createCode = ({token}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.ssocode;
    const code = normalCode();
    await db.put(code, {token, code});
    resolve(code)
  } catch(e){
    reject(e)
  }
});

export default module.exports = createCode