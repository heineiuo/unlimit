import uuid from 'uuid'
import Joi from 'joi'

const createUser = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const db = getCtx().leveldb.sub('user');
  const validated = Joi.validate(query, Joi.object().keys({}, {allowUnknown: true}));
  if (validated.error) return reject(validated.error);
  try {
    const id = uuid.v1();
    const value = {
      ...validated.value,
      id,
      userId: id
    }
    await db.put(id, value);
    resolve(value)
  } catch(e){
    reject(e)
  }
});

export default module.exports = createUser