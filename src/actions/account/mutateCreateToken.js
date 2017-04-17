/* @public */
import Joi from 'joi'
import queryOne from './queryOne'
import getLeveldb from "../../leveldb"
import crypto from 'crypto'
import uuid from 'uuid'

const createTokenByUserId = userId => new Promise(async (resolve, reject) => {
  const normalToken = () => crypto.randomBytes(48).toString('hex');

  try {
    const db = (await getLeveldb()).sub('token');
    const nextToken = {token: normalToken(), userId, updateTime: Date.now()};
    await db.put(nextToken.token, nextToken);
    resolve(nextToken)
  } catch(e){
    reject(e)
  }
});

const queryCodeLevel = (db, key) => new Promise(async resolve => {
  try {
    const result = await db.get(key);
    const validated = Joi.validate(result, Joi.object().keys({
      code: Joi.string().length(6).required(),
      createTime: Joi.number().length(14).required()
    }))
    if (validated.error) return resolve(null)
    resolve(result)
  } catch(e){
    resolve(null)
  }
})


/**
 * 检查验证码
 */
const checkCode = ({email, code}) => new Promise(async (resolve, reject) => {
  try {
    const db = (await getLeveldb()).sub('emailcode');
    const result = await queryCodeLevel(db, email);
    if (!result) return reject(new Error('ILLEGAL_CODE'));
    if (result.code !== code) return reject(new Error('ILLEGAL_CODE'));
    if (Date.now() > result.createTime + 6000 * 3) return reject(new Error('EXPIRE_CODE'));
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
const createTokenByAuthCode = ({authCode}) => new Promise(async(resolve, reject) => {
  try {
    const db = (await getLeveldb()).sub('ssocode');
    const result = await db.get(authCode);
    resolve({token: result.token});
  } catch(e){
    reject(e)
  }
});


const createUser = (email) => new Promise(async (resolve, reject) => {
  const db = (await getLeveldb()).sub('user');
  try {
    const id = uuid.v1();
    const value = {
      email,
      id,
      userId: id
    }
    await db.put(id, value);
    resolve(value)
  } catch(e){
    reject(e)
  }
});


export const validate = query => Joi.validate(query, Joi.object().keys({
  email: Joi.string().required(),
  driveId: Joi.string().required(),
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

  try {
    await checkCode({email, code});
    const result = await dispatch(queryOne({email, enableNull: true}));
    let userId = null;
    if (!result) {
      const db = (await getLeveldb).sub('email')
      const user = await createUser(email);
      userId = user.userId;
      await db.put(email, {userId: user.id, email});
    } else {
      userId = result.userId
    }
    resolve(await createTokenByUserId(userId, driveId))
  } catch(e) {
    reject(e)
  }
});