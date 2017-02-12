
import {Model} from 'sprucejs'
import crypto from 'crypto'

/**
 * 生成超时时间 * 分钟
 * @param minute
 * @returns {number}
 */
export const createExpire = (minute=5) => Date.now()+ 60000 * minute;

const normalToken = () => crypto.randomBytes(48).toString('hex');

class Token extends Model {

  /**
   * 创建token
   */
  _createToken = (userId) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;

      const newToken = normalToken();
      const value = {token: newToken, userId};
      await db.put(newToken, value);
      resolve(value)
    } catch(e){
      reject(e)
    }
  });


  /**
   * @api {POST} /account/session 获取session信息
   * @apiName Session
   * @apiGroup Account
   * @apiDescription 获取session信息
   * @apiParam {string} token 令牌
   * @apiSuccess {object} user
   */
  session = (query) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;
      const token = await db.get(query.token);
      resolve(await reducers.User.Get(token.userId))
    } catch(e){
      if (e.name == 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
      reject(e)
    }
  });

  /**
   * @api {POST} /account/token/gettokenbyemailcode 根据email验证码获取token
   * @apiName TokenByEmailCode
   * @apiGroup Account
   * @apiParam {string} code
   * @apiParam {string} email
   * @apiSuccess {string} token
   */
  getTokenByEmailCode = (query) => new Promise(async(resolve, reject) => {
    try {
      const {code, email} = query;
      const {db, reducers} = this.props;
      await reducers.EmailCode._checkCode(email, code);
      const userId = await reducers.Email._getUserIdWithUpset(email);
      const token = await this._createToken(userId);
      resolve(token)

    } catch(e) {
      reject(e)
    }

  });

  /**
   * @api {POST} /account/token/gettokenbyssocode 根据ssocode获取token
   * @apiName TokenBySSOCode
   * @apiGroup Account
   * @apiParam {string} code code
   * @apiSuccess {string} token token
   */
  getTokenBySSOCode = (query) => new Promise(async(resolve, reject) => {
    try {
      const {db, reducers} = this.props;
      const result = await reducers.SSOCode.get(query.code);
      resolve({token: result.token});
    } catch(e){
      reject(e)
    }
  });

  /**
   * @api {POST} /account/token/logout 注销token
   * @apiName Logout
   * @apiGroup Account
   * @apiParam {string} token token
   */
  logout = (query, ctx) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;

      if (ctx.res.session.user) {
        await db.del(query.token)
      }
      resolve({})
    } catch(e){
      reject(e)
    }
  });

  resolve = (query) => {
    const {action} = query;
    if (action == 'session') return this.session(query);
    if (action == 'getTokenByEmailCode') return this.getTokenByEmailCode(query);
    if (action == 'getTokenBySSOCode') return this.getTokenBySSOCode(query);
    if (action == 'logout') return this.logout(query);
    return new Promise((resolve, reject) => reject(new Error('ACTION_NOT_FOUND')))

  }

}

module.exports = Token;