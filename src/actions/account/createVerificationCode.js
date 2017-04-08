import AliPush from 'ali-push'
import config from '../../config'

let client = null;

/**
 * 生成数字验证码
 * @param length 验证码长度
 */
export const createNumberCode = function(length=6){
  const fill0 = (str) => str.length === length?str:fill0(`${str}0`);
  return fill0(String(Math.random()).substr(2, length));
};

/**
 * @api {POST} /account2/emailcode/createVerificationCode 获取登录验证码
 * @apiGroup Account
 * @apiName EmailCodeForLogin
 * @apiParam {string} email 邮箱
 */
const createVerificationCode = ({email}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('emailcode');
    // console.log(email);
    const code = createNumberCode();
    await db.put(email, {code, createTime: Date.now()});
    console.log(code, Date.now());

    const options = {
      ToAddress: email,
      Subject: '验证码',
      FromAlias: '右括号',
      TextBody: `您的验证码为${code}`
    };

    if (!client) {
      client = new AliPush({
        AccessKeyId: config.production().aliyun.accessid,
        AccessKeySecret: config.production().aliyun.accesskey,
        AccountName: config.production().aliyun.dms.accountName
      });
    }

    client.SingleSendMail(options, (err, res, body) => {
      if (err) return reject(err);
      resolve({})
    });

  } catch (e) {
    reject(e)
  }
});

export default module.exports = createVerificationCode