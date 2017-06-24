/* @private */
import Joi from "joi"
import {ObjectId} from 'mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  userId: Joi.string(),
  email: Joi.string(),
  enableNull: Joi.boolean().default(false)
}).xor(['userId', 'email']), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {userId, email, enableNull} = validated.value;
  const {getMongodb} = getCtx()
  try {
    const filter = {};
    if (userId) {
      filter._id = ObjectId(userId)
    } else {
      filter.email = email
    }
    const db = (await getMongodb()).collection('user');
    const result = await db.findOne(filter)
    if (result === null) {
      if (enableNull) return resolve(null)
      return reject(new Error('NOT_FOUND'))
    }
    resolve({...result, userId: result._id.toString()})
  } catch (e) {
    reject(e)
  }
});

