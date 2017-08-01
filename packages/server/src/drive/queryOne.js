import Joi from 'joi'

const queryOneSchema = Joi.object().keys({
  domain: Joi.string().regex(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/),
  name: Joi.string().regex(/^[a-z]{1,1}[a-z0-9]{2,30}$/),
  driveId: Joi.string(),
  fields: Joi.array().default(['name'])
}).xor('domain', 'driveId', 'name')


export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryOneSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {domain, driveId, name, fields} = validated.value;
  try {
    const {db} = getCtx()
    const driveDb = db.collection('drive');
    const filter = driveId ? {_id: driveId} :
      name ? {name} :
      {domains: {$elemMatch: {$eq: domain}}}
    const result = await driveDb.findOne(filter, {fields})
    const error = new Error('Cannot find target drive')
    error.name = 'NotFoundError'
    if (!result) return reject(error)
    resolve({...result, driveId: result._id})
  } catch(e){
    reject(e)
  }
})
