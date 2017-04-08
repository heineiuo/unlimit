import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

/**
 *
 * @param token
 * @returns {Promise}
 */
const createAuthCode = ({token}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    if (!getCtx().request.headers.session) reject(new Error('ERR_NOT_LOGGED'));
    const db = getCtx().leveldb.sub('ssocode');
    const code = normalCode();
    await db.put(code, {token, code});
    resolve(code)
  } catch(e){
    reject(e)
  }
});

export default module.exports = createAuthCode