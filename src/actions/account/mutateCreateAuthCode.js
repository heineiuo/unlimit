/* @public */

import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

export default ({token}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const {getMongodb, leveldb, request: {headers: {session}}} = getCtx()
    if (!session) reject(new Error('ERR_NOT_LOGGED'));
    const db = leveldb.sub('ssocode');
    const code = normalCode();
    await db.put(code, {token, code});
    resolve(code)
  } catch(e){
    reject(e)
  }
});
