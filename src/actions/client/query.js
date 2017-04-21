import Joi from 'joi'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  limit: Joi.number().min(1).max(100).default(20),
  name: Joi.string(),
  id: Joi.string(),
  fields: Joi.array().default(['status', 'name', 'id'])
}).xor(['name', 'id']), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  let {limit, fields, name, id} = validated.value;
  try {
    const db = (await getMongodb()).collection('client');
    const filter = {}
    fields = fields.filter(item => item !== 'token');
    filter.$or = [{name}, {id}];
    const data = await db.find(filter, {fields}).limit(limit).toArray()
    resolve({data})
  } catch (e) {
    reject(e)
  }
})