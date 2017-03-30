/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
const logout = ({token}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.sub('token');
    if (ctx.request.headers.session.user) {
      await db.del(token)
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = logout