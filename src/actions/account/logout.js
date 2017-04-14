/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
export default ({token}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('token');
    if (getCtx().request.headers.session.user) {
      await db.del(token)
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

