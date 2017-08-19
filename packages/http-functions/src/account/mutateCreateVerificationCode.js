import AliPush from 'ali-push'
import Joi from 'joi'

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
export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = validate(query)
  if (validated.error) return reject(validated.error)
  const {email} = validated.value;
  try {
    const {db} = getState();
    const emailcodedb = db.collection('emailcode');
    const code = createNumberCode();
    await emailcodedb.insertOne({_id: email, code, createTime: Date.now()});

    const options = {
      ToAddress: email,
      Subject: '验证码',
      FromAlias: '右括号',
      TextBody: `您的验证码为${code}`
    };

    const { 
      NODE_ENV,
      ALIYUN_ACCESS_ID,
      ALIYUN_ACCESS_SECRET,
      ALIYUN_DMS_ACCOUNT_NAME,
    } = process.env

    if (!(NODE_ENV === 'production')) return resolve({email})

    if (!client) {
      client = new AliPush({
        AccessKeyId: ALIYUN_ACCESS_ID,
        AccessKeySecret: ALIYUN_ACCESS_SECRET,
        AccountName: ALIYUN_DMS_ACCOUNT_NAME
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

