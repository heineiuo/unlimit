import Joi from 'joi'
import {ObjectId} from 'mongodb'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  domain: Joi.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/),
  name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9_]{5,30}$/),
  driveId: Joi.string(),
  fields: Joi.array().default(['name'])
}).xor('domain', 'driveId', 'name'))

export default query => (dispatch, geCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {domain, driveId, name, fields} = validated.value;
  try {
    const drive = (await getMongodb()).collection('drive');
    const filter = driveId ? {_id: ObjectId(driveId)} :
      name ? {name} :
      {domains: {$elemMatch: {$eq: domain}}}
    resolve(await drive.findOne(filter, {fields}))
  } catch(e){
    reject(e)
  }
})