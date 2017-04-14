/**
 * @private
 */

import createUser from './createUser'

export default ({email, upset=true}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  let result = null;
  try {
    const db = getCtx().leveldb.sub('email');
    try {
      result = await db.get(email);
      if (typeof result === 'string') {
        result = {userId: result, email}
        await db.put(email, result)
      }
    } catch(e){
      if (e.name !== 'NotFoundError') return reject(e);
      if (!upset) return reject('NOT_FOUND')
      try {
        const user = await dispatch(createUser({email}));
        result = {userId: user.id, email};
        await db.put(email, result);
      } catch(e){
        return reject(e)
      }
    }
  } catch (e) {
    return reject(e)
  }

  console.log(result)
  resolve(result)
});

