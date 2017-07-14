import Joi from 'joi'
import {ObjectId} from 'mongodb'

const queryOneSchema = Joi.object().keys({
  domain: Joi.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/),
  name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{2,30}$/),
  driveId: Joi.string(),
  fields: Joi.array().default(['name'])
}).xor('domain', 'driveId', 'name')

export default query => (dispatch, geCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryOneSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, driveId, name, fields} = validated.value;
  const {getMongodb, getConfig} = getCtx()
  try {
    const drive = (await getMongodb()).collection('drive');
    const filter = driveId ? {_id: ObjectId(driveId)} :
      name ? {name} :
      {domains: {$elemMatch: {$eq: domain}}}
    const result = await drive.findOne(filter, {fields})
    if (!result) return reject(new Error('NOT_FOUND'))
    resolve({...result, driveId: result._id.toString()})
  } catch(e){
    reject(e)
  }
})
