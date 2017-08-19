/* @private */
import Joi from "joi"


export const validate = query => Joi.validate(query, Joi.object().keys({
  userId: Joi.string(),
  email: Joi.string(),
  enableNull: Joi.boolean().default(false)
}).xor(['userId', 'email']), {allowUnknown: true})

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {userId, email, enableNull} = validated.value;
  try {
    const {db} = getState()
    const filter = {};
    if (userId) {
      filter._id = userId
    } else {
      filter.email = email
    }
    const userDb = db.collection('user');
    const result = await userDb.findOne(filter)
    if (result === null) {
      if (enableNull) return resolve(null)
      return reject(new Error('NOT_FOUND'))
    }
    resolve({...result, userId: result._id})
  } catch (e) {
    reject(e)
  }
});

