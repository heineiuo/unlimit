import getUser from "../user/getUser"
import {connect, bindActionCreators} from "action-creator"

/**
 * @api {POST} /account2/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
const session = ({token}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.token;
    const result = await db.get(token);
    const {getUser} = getAction();
    resolve(await getUser({userId: result.userId}));
  } catch (e) {
    if (e.name == 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    getUser
  })
)(session);