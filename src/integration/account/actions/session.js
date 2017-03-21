import getUser from "./getUser"
import {connect, bindActionCreators} from "../../tools"

/**
 * @api {POST} /account/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
const session = ({token}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const {db} = ctx;
    const result = await db.token.get(token);
    const {getUser} = getAction();
    resolve(await getUser({userId: result.userId}));
  } catch (e) {
    if (e.name == 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
    reject(e)
  }
});

module.exports = connect(
  bindActionCreators({
    getUser
  })
)(session);