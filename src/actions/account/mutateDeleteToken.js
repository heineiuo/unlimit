/**
 * @api {POST} /account/token/logout 注销token
 * @apiName Logout
 * @apiGroup Account
 * @apiParam {string} token token
 */
export default ({token}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const {getMongodb} = getCtx();
  try {
    const db = (await getMongodb()).collection('token');
    if (getCtx().request.headers.session.user) {
      await db.findOneAndDelete({token})
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

