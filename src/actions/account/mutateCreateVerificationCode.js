import AliPush from 'ali-push'
import getConfig from '../../config'
import Joi from 'joi'
import getLeveldb from '../../leveldb'

let client = null;

/**
 * 生成数字验证码
 * @param length 验证码长度
 */
export const createNumberCode = function(length=6){
  const fill0 = (str) => str.length === length?str:fill0(`${str}0`);
  return fill0(String(Math.random()).substr(2, length));
};

export const validate = query => Joi.validate(query, Joi.object().keys({
  email: Joi.string().required()
}), {allowUnknown: true})

/**
 * @api {POST} /account2/emailcode/createVerificationCode 获取登录验证码
 * @apiGroup Account
 * @apiName EmailCodeForLogin
 * @apiParam {string} email 邮箱
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {email} = validated.value;
  try {
    const config = await getConfig();
    const db = (await getLeveldb()).sub('emailcode');
    const code = createNumberCode();
    await db.put(email, {code, createTime: Date.now()});
    console.log({email, code})

    const options = {
      ToAddress: email,
      Subject: '验证码',
      FromAlias: '右括号',
      TextBody: `您的验证码为${code}`
    };

    if (config.debug) return resolve({email})

    if (!client) {
      client = new AliPush({
        AccessKeyId: config.production.aliyun.accessid,
        AccessKeySecret: config.production.aliyun.accesskey,
        AccountName: config.production.aliyun.dms.accountName
      });
    }

    client.SingleSendMail(options, (err, res, body) => {
      if (err) return reject(err);
      resolve({email})
    });

  } catch (e) {
    reject(e)
  }
});

