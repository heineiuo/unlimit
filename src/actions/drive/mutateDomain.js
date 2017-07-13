import Joi from 'joi'
import {ObjectId} from 'mongodb'
import queryOne from './queryOne'

const mutateDomainSchema = Joi.object().keys({
  driveId: Joi.string().required(),
  add: Joi.array().default([]),
  remove: Joi.array().default([])
})



export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateDomainSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {driveId,add, remove} = validated.value;
  const {getMongodb, getLeveldb, getConfig} = getCtx()
  
  try {
    const db = (await getMongodb()).collection('drive');
    const driveData = await dispatch(queryOne({driveId, fields: ['domains']}));
    if (!driveData) return reject(new Error('DRIVE_NOT_FOUND'));
    const nextDomains = driveData.domains.slice()
      .filter(item => remove.includes(item))
      .concat(add)
    await db.findOneAndUpdate({_id: ObjectId(driveId)}, {$set: {domains: nextDomains}})
    resolve({})
  } catch(e){
    reject(e)
  }
})
