import Joi from 'joi'


const mutateLocationSchema = Joi.object().keys({
  driveId: Joi.string().required(),
  locations: Joi.array().required(),
})

export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateLocationSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {locations, driveId} = validated.value;
  
  try {
    const {db, config, request: {headers: {session}}} = getCtx()
    const {userId} = session;
    const driveDb = db.collection('drive');
    const locationResult = await driveDb.findOne({_id: driveId});
    locationResult.users = locationResult.users.filter(item => item !== userId).concat([userId]);
    locationResult.locations = locations;
    await driveDb.findOneAndUpdate({_id: driveId}, {$set: locationResult});
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});
