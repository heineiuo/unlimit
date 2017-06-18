import Joi from 'joi'
import getMongodb from '../../mongodb'

const mutateLocationSchema = Joi.object().keys({
  driveId: Joi.string().required(),
  locations: Joi.array().required(),
})



export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, mutateLocationSchema, {allowUnknown: true});
  if (validated.error) return reject(validated.error);
  const {locations, driveId} = validated.value;

  try {
    const db = getCtx().leveldb.sub('location');
    const location = await db.get(driveId);
    const {userId} = getCtx().request.headers.session;
    location.users = location.users.filter(item => item !== userId).concat([userId]);
    location.locations = locations;
    await db.put(driveId, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});
