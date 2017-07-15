/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
export default ({token}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const {db} = getCtx()
    const tokenDb = db.collection('token')
    if (getCtx().request.headers.session.user) {
      await tokenDb.findOneAndDelete({_id: token})
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

