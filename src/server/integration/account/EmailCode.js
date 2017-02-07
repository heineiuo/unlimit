
import {Model} from 'sprucejs'
import AliPush from 'ali-push'
import config from '../../utils/config'

const client = new AliPush({
  AccessKeyId: config.production.aliyun.accessid,
  AccessKeySecret: config.production.aliyun.accesskey,
  AccountName: config.production.aliyun.dms.accountName
});

/**
 * 生成数字验证码
 * @param length 验证码长度
 */
export const createNumberCode = function(length=6){
  const fill0 = (str) => str.length == length?str:fill0(`${str}0`);
  return fill0(String(Math.random()).substr(2, length));
};

class EmailCode extends Model {

  /**
   * @api {POST} /account/emailcode/createlogincode 获取登录验证码
   * @apiGroup Account
   * @apiName EmailCodeForLogin
   * @apiParam {string} email 邮箱
   */
  createLoginCode = (query, ctx) => new Promise(async (resolve, reject) => {
    try {
      const {email} = query;
      const {db} = this.props;
      console.log(email);
      const code = createNumberCode();
      await db.put(email, {code, createTime: Date.now()});

      const options = {
        ToAddress: email,
        Subject: '验证码',
        FromAlias: '右括号',
        TextBody: `您的验证码为${code}`
      };

      client.SingleSendMail(options, (err, res, body) => {
        if (err) return reject(err);
        resolve({})
      });

    } catch (e) {
      reject(e)
    }
  });

  /**
   * 检查code
   */
  _checkCode = (email, code) => new Promise(async (resolve, reject) => {
    try {
      const {db, reducers} = this.props;
      const result = await db.get(email);
      if (result.code != code) return reject(new Error('ILLEGAL_CODE'));
      if (result.createTime + 6000 * 3 > Date.now()) return reject(new Error('EXPIRE_CODE'));
      await db.del(email);
      resolve(true)
    } catch(e){
      if (e.name == 'NotFoundError') return reject(new Error('ILLEGAL_CODE'));
      reject(e)
    }
  });

  resolve(){

  }
}

module.exports = EmailCode;