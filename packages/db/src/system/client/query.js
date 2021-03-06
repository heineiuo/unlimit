import Joi from 'joi'
import {querySchema} from './schema'

export default query => (dispatch, getState) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, querySchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  let {limit, fields, name, id} = validated.value;

  try {
    const clientDb = getState().db.collection('client');
    const filter = {$or: []}
    fields = fields.filter(item => item !== 'token');
    if (name) filter.$or.push({name})
    if (id) filter.$or.push({id})
    if (filter.$or.length === 0) delete filter.$or
    const data = await clientDb.find(filter, {fields}).limit(limit).toArray()
    resolve({data})
  } catch (e) {
    reject(e)
  }
})
