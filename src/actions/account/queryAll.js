/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve,reject) => {
  const {getMongodb} = getCtx()
  try {
    const db = (await getMongodb()).collection('user');
    const limit = query.limit || 20;
    const list = await db.find({}).limit(20)
    resolve({list})
  } catch(e){
    reject(e)
  }
});


