/* @public */
import Joi from 'joi'
import getLeveldb from '../../leveldb'
import queryOne from './queryOne'
import queryOneClient from '../client/queryOne'

const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    const value = await db.get(key);
    const validated = Joi.validate(value, Joi.object().keys({
      userId: Joi.string().required(),
      email: Joi.string()
    }), {allowUnknown: true})
    if (validated.error) return resolve(null)
    resolve(value)
  } catch(e){
    resolve(null)
  }
})

export const validate = query => Joi.validate(query, Joi.object().keys({
  token: Joi.string().required()
}), {allowUnknown: true})

/**
 * @api {POST} /account2/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
export default query => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {token} = validated.value;
  try {
    const db = await getLeveldb();
    const userdb = db.sub('user');
    const {id: userId} = await dispatch(queryOneClient({token}))
    let user = await queryLevel(userdb, userId);
    if (user === null) {
      user = await dispatch(queryOne({userId}))
      userdb.put(userId, user)
    }
    resolve(user);
  } catch (e) {
    if (e.name === 'NotFoundError') return resolve(null);
    reject(e)
  }
});

