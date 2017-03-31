import uuid from 'uuid'
import Joi from 'joi'

const createUser = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({

    }, {allowUnknown: true}));
    if (validated.error) return reject(validated.error);
    const db = getCtx().db.sub('user');
    const id = uuid.v4();
    await db.put(id, {...query, id, userId: id});
    resolve({id: id})
  } catch(e){
    reject(e)
  }
});

export default module.exports = createUser