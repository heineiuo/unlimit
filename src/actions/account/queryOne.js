/* @private */
import Joi from "joi"
import getLevel from '../../leveldb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  email: Joi.string().required(),
  enableNull: Joi.string().default(false)
}))

export const queryLevel = (db, key) => new Promise(async resolve => {
  try {
    resolve(await db.get(key))
  } catch (e) {
    resolve(null)
  }
})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error)
  const {email, enableNull} = validated.value;
  try {
    const db = (await getLevel()).sub('email');
    let result = await queryLevel(db, email);
    if (!result && !enableNull) return reject(new Error('NOT_FOUND'));
    resolve(result)
  } catch (e) {
    reject(e)
  }
});

