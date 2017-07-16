/* @public */
import Joi from 'joi'
import queryOne from './queryOne'
import ms from 'ms'
import mutateInsertOne from '../client/mutateInsertOne'



/**
 * 检查验证码
 */
const checkCode = ({ email, code }) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const { db } = getCtx();
    const emailcodeDb = db.sub('emailcode');
    const result = await emailcodeDb.findOne({ email });
    if (!result) return reject(new Error('ILLEGAL_CODE_A'));
    if (result.code !== code) return reject(new Error('ILLEGAL_CODE_B'));
    if (Date.now() > result.createTime + ms('5m')) return reject(new Error('EXPIRE_CODE'));
    await emailcodeDb.findOneAndDelete({ email });
    resolve(true)
  } catch (e) {
    if (e.name === 'NotFoundError') return reject(new Error('ILLEGAL_CODE'));
    reject(e)
  }
});


/**
 * @api {POST} /account/createTokenByAuthCode 根据AuthCode获取token
 * @apiName TokenBySSOCode
 * @apiGroup Account
 * @apiParam {string} code code
 * @apiSuccess {string} token token
 */
const createTokenByAuthCode = ({ authCode }, db) => new Promise(async (resolve, reject) => {
  try {
    const ssocodeDb = db.collection('ssocode');
    const result = await ssocodeDb.findOne({ _id: authCode });
    resolve({ token: result.token });
  } catch (e) {
    reject(e)
  }
});


const createUser = (email, db) => new Promise(async (resolve, reject) => {
  try {
    const userdb = db.collection('user');
    const result = await userdb.insertOne({
      email, createTime: Date.now()
    })
    const user = result.ops[0];
    resolve({ ...user, userId: user._id })
  } catch (e) {
    reject(e)
  }
});


export const validate = query => Joi.validate(query, Joi.object().keys({
  email: Joi.string().required(),
  driveId: Joi.string(),
  code: Joi.string().length(6).required()
}), { allowUnknown: true })



/**
 * @api {POST} /account2/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const { code, email, driveId } = validated.value;
  // todo 发放OAuth授权令牌
  try {
    const { db } = getCtx()
    await dispatch(checkCode({ email, code }));
    const result = await dispatch(queryOne({ email, enableNull: true }));
    const userId = result === null ? (await createUser(email, db)).userId : result.userId;
    if (!userId) return reject(new Error('EXCEPTION_ERROR'))
    resolve(await dispatch(mutateInsertOne({ id: userId, name: 'user', type: 'user' })))
  } catch (e) {
    reject(e)
  }
});
