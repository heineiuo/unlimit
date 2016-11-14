/**
 * Copyright YouKuoHao Inc.
 */

import uuid from 'uuid'
import {Model} from '../../utils/spruce'

const User = new Model('User', {})

User.createUser = (options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = uuid.v4()
      await User.put(id, Object.assign({}, options, {id}))
      resolve({id: id})
    } catch(e){
      reject(e)
    }
  })
}

User.statics.userList = (query, ctx) => new Promise(async (resolve,reject) => {
  try {
    const models = {
      User,
    }

    const result = {};
    result[`${ctx.req.body.model}`] = await models[ctx.req.body.model].find({});
    resolve(result)
  } catch(e){
    reject(e)
  }
});

export default User
