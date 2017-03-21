/**
 * @api {POST} /account/user/userlist 获取用户列表
 * @apiName UserList
 * @apiGroup Account
 * @apiParam {string} model model名, user
 */
const userList = () => (ctx, getAction) => new Promise(async (resolve,reject) => {
  try {
    const db = ctx.db.user;
    const list = [];
    db.createReadStream()
      .on('data', (item) => {
        list.push(item)
      })
      .on('end', () => {
        resolve(list)
      });

  } catch(e){
    reject(e)
  }
});

export default module.exports = userList
