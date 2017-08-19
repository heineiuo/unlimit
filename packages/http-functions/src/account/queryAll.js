/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve,reject) => {
  try {
    const {db} = getCtx()
    const limit = query.limit || 20;
    const userDb = db.collection('user')
    const list = await userDb.find({}).limit(limit).toArray()
    resolve({list})

  } catch(e){
    reject(e)
  }
});
