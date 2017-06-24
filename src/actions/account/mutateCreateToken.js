/* @public */
import Joi from 'joi'
import queryOne from './queryOne'
import ms from 'ms'
import mutateInsertOne from '../client/mutateInsertOne'

const queryCodeLevel = (db, key) => new Promise(async resolve => {
  try {
    const result = await db.get(key);
    const validated = Joi.validate(result, Joi.object().keys({
      code: Joi.string().length(6).required(),
      createTime: Joi.number().required()
    }))
    if (validated.error) {
      return resolve(null)
    }
    resolve(result)
  } catch(e){
    resolve(null)
  }
})


/**
 * 检查验证码
 */
const checkCode = ({email, code}) => new Promise(async (resolve, reject) => {
  const {leveldb} = getCtx();
  try {
    const db = leveldb.sub('emailcode');
    const result = await queryCodeLevel(db, email);
    if (!result) return reject(new Error('ILLEGAL_CODE_A'));
    if (result.code !== code) return reject(new Error('ILLEGAL_CODE_B'));
    if (Date.now() > result.createTime + ms('5m')) return reject(new Error('EXPIRE_CODE'));
    await db.del(email);
    resolve(true)
  } catch(e){
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
const createTokenByAuthCode = ({authCode}, leveldb) => new Promise(async(resolve, reject) => {
  try {
    const db = leveldb.sub('ssocode');
    const result = await db.get(authCode);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
});


const createUser = (email, getMongodb) => new Promise(async (resolve, reject) => {
  try {
    const db = (await getMongodb()).collection('user');
    const result = await db.insertOne({
      email, createTime: Date.now()
    })
    const user = result.ops[0];
    resolve({...user, userId: user._id.toString()})
  } catch(e){
    reject(e)
  }
});


export const validate = query => Joi.validate(query, Joi.object().keys({
  email: Joi.string().required(),
  driveId: Joi.string(),
  code: Joi.string().length(6).required()
}), {allowUnknown: true})



/**
 * @api {POST} /account2/token/gettokenbyemailcode 根据email验证码获取token
 * @apiName TokenByEmailCode
 * @apiGroup Account
 * @apiParam {string} code
 * @apiParam {string} email
 * @apiSuccess {string} token
 */
export default query => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {code, email, driveId} = validated.value;
  const {getMongodb} = getCtx()
  // todo 发放OAuth授权令牌
  try {
    await checkCode({email, code});
    const result = await dispatch(queryOne({email, enableNull: true}));
    const userId = result === null ? (await createUser(email, getMongodb)).userId : result.userId;
    if (!userId) return reject(new Error('EXCEPTION_ERROR'))
    resolve(await dispatch(mutateInsertOne({id: userId, name: 'user', type: 'user'})))
  } catch(e) {
    reject(e)
  }
});
