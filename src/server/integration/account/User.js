/**
 * Copyright YouKuoHao Inc.
 */

import uuid from 'uuid'
import {Model} from '../../spruce'

const User = new Model('User', {});

User._createUser = (options) => new Promise(async (resolve, reject) => {
  try {
    const id = uuid.v4();
    await User.put(id, Object.assign({}, options, {id}));
    resolve({id: id})
  } catch(e){
    reject(e)
  }
});

/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
User.statics.userList = (query, ctx) => new Promise(async (resolve,reject) => {
  try {
    const models = {
      User,
    };

    const result = {};
    result[`${ctx.req.body.model}`] = await models[ctx.req.body.model].find({});
    resolve(result)
  } catch(e){
    reject(e)
  }
});

export default module.exports = User
