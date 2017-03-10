
import uuid from 'uuid'
import {Model} from 'sprucejs'

/**
 * @schema
 * key: userId
 * value:
 *  id,
 *  email,
 *  role
 */
class User extends Model {

  _createUser = (options) => new Promise(async (resolve, reject) => {
    try {
      const {db} = this.props;
      const id = uuid.v4();
      await db.put(id, Object.assign({}, options, {id}));
      resolve({id: id})
    } catch(e){
      reject(e)
    }
  });

  Get = (userId) => {
    const {db} = this.props;
    return db.get(userId)
  };

  /**
   * @api {POST} /account/user/userlist 获取用户列表
   * @apiName UserList
   * @apiGroup Account
   * @apiParam {string} model model名, user
   */
  userList = (query, ctx) => new Promise(async (resolve,reject) => {
    try {
      const {db} = this.props;
      const list = await db.find({});
      resolve({list})
    } catch(e){
      reject(e)
    }
  });

  resolve(req){
    if (req.action == 'getList') return this.userList(req);
    return new Promise((resolve, reject) => reject(new Error('ACTION_NOT_FOUND')))
  }

}

module.exports = User;
