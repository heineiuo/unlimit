/* @public */

import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

export default ({token}) => (dispatch, getState) => new Promise(async(resolve, reject) => {
  try {
    const {db, request: {headers: {session}}} = getState()
    if (!session) reject(new Error('ERR_NOT_LOGGED'));
    const ssocodeDb = getState().db.collection('ssocode');
    const code = normalCode();
    await ssocodeDb.insertOne({_id: code, token, code});
    resolve(code)
  } catch(e){
    reject(e)
  }
});
