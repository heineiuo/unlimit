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
    const filter = {$or: []}
    fields = fields.filter(item => item !== 'token');
    if (name) filter.$or.push({name})
    if (id) filter.$or.push({id})
    if (filter.$or.length === 0) delete filter.$or
    const data = await db.find(filter, {fields}).limit(limit).toArray()
    resolve({data})
  } catch (e) {
    reject(e)
  }
})