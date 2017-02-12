
import {Model} from 'sprucejs'
import crypto from 'crypto'

const normalCode = () => crypto.randomBytes(32).toString('hex');

class SSOCode extends Model {

  /**
   *
   * @param token
   * @returns {Promise}
   */
  _createCode = (token) => new Promise(async(resolve, reject) => {
    try {
      const {db} = this.props;
      const code = normalCode();
      await db.put(code, {token, code});
      resolve(code)
    } catch(e){
      reject(e)
    }
  });

  /**
   * @api {POST} /account/ssocode/get 获取ssocode
   * @apiName SSOCodeGet
   * @apiGroup Account
   * @apiParam {string} token
   * @apiSuccess {string} code
   */
  Get = (query, ctx) => new Promise(async (resolve, reject) => {
    const {token} = query;
    if (!ctx.res.session.user) reject(new Error('ERR_NOT_LOGGED'));
    const code = await this._createCode(token);
    resolve({code})
  });

  resolve = (query) => {
    const {action} = query;
    if (action == 'Get') return this.Get(query);
    return new Promise((resolve, reject) => reject(new Error('ACTION_NOT_FOUND')))
  }

}

module.exports = SSOCode;
