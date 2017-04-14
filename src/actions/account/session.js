/* @public */
import getUser from "./getUser"

/**
 * @api {POST} /account2/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
export default ({token}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('token');
    const result = await db.get(token);
    const user = await dispatch(getUser({userId: result.userId}));
    resolve({...user, userId: user.id});
  } catch (e) {
    if (e.name === 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
    reject(e)
  }
});

