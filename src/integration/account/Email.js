/**
 * Copyright YouKuoHao Inc.
 */

import {Model} from '../../spruce'
import User from './User'

const Email = new Model('Email', {});

/**
 *
 */
Email._getUserIdWithUpset = (email, userId) => new Promise(async (resolve, reject) => {
  try {
    try {
      const result = await Email.get(email);
      resolve(result)
    } catch(e){
      if (e.name != 'NotFoundError') return reject(e);
      try {
        const user = await User._createUser({email});
        await Email.put(email, user.id);
        resolve(user.id)
      } catch(e){
        reject(e)
      }
    }
  } catch (e) {
    reject(e)
  }
});


export default module.exports = Email
