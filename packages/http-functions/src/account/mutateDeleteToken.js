/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
export default ({token}) => (dispatch, getState) => new Promise(async (resolve, reject) => {
  try {
    const {db} = getState()
    const tokenDb = db.collection('token')
    if (getState().request.headers.session.user) {
      await tokenDb.findOneAndDelete({_id: token})
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

