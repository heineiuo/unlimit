/* @public */
import Joi from 'joi'
import getLeveldb from '../../leveldb'

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
    const tokendb = db.sub('token');
    const userdb = db.sub('user');
    const result = await tokendb.get(token);
    const user = await userdb.get(result.userId);
    resolve({...user, userId: user.id});
  } catch (e) {
    if (e.name === 'NotFoundError') return reject(new Error('EMPTY_SESSION'));
    reject(e)
  }
});

