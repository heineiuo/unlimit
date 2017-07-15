import Joi from 'joi'

export const mutateDisableSchema = Joi.object().keys({
  driveId: Joi.string().required()
})

export default query => dispatch => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateDisableSchema, {allowUnknown: true})
  const {driveId} = validated.value;
  const {db, config} = getCtx()
  try {
    const driveDb = db.collection('drive');
    await driveDb.findOneAndUpdate({_id: driveId}, {$set: {status: 0}})
    resolve({ok: 'ok'})
  } catch(e){
    reject(e)
  }
})
