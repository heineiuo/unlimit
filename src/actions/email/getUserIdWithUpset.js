
import createUser from '../user/createUser'

const getUserIdWithUpset = ({email, userId}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().db.sub('email');

    try {
      const result = await db.get(email);
    } catch(e){
      if (e.name !== 'NotFoundError') return reject(e);
      try {
        const user = await dispatch(createUser)({email});
        await db.put(email, user.id);
        resolve(user.id)
      } catch(e){
        reject(e)
      }
    }
  } catch (e) {
    reject(e)
  }
});

export default module.exports = getUserIdWithUpset