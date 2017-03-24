import {connect, bindActionCreators } from 'action-creator'

import createUser from '../user/createUser'

const getUserIdWithUpset = ({email, userId}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.email;
    const {createUser} = getAction();

    try {
      const result = await db.get(email);
      resolve(result)
    } catch(e){
      if (e.name != 'NotFoundError') return reject(e);
      try {
        const user = await createUser({email});
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

export default module.exports = connect(
  bindActionCreators({
    createUser
  })
)(getUserIdWithUpset);