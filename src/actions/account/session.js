import getUser from "./getUser"

/**
 * @api {POST} /account2/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
const session = ({token}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('token');
    const result = await db.get(token);
    resolve(await dispatch(getUser({userId: result.userId})));
  } catch (e) {
    if (e.name === 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
    reject(e)
  }
});

export default module.exports = session