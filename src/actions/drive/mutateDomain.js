import getMongodb from '../../mongodb'
import Joi from 'joi'
import {ObjectId} from 'mongodb'
import queryOne from './queryOne'

export const validate = query => Joi.validate(query, Joi.object().keys({
  driveId: Joi.object().required(),
  add: Joi.array().default([]),
  remove: Joi.array().default([])
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {driveId,add, remove} = validated.value;

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