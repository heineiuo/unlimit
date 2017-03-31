/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
const userList = (query) => (dispatch, getCtx) => new Promise(async (resolve,reject) => {
  try {
    const db = getCtx().db.sub('user');
    const limit = query.limit || 20;
    const list = [];
    db.createReadStream({limit})
      .on('data', (item) => {
        list.push(item.value)
      })
      .on('end', () => {
        resolve({list})
      });

  } catch(e){
    reject(e)
  }
});

export default module.exports = userList
