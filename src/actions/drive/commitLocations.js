import Joi from 'joi'
import ent from 'ent'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  driveId: Joi.string().required(),
  locations: Joi.array().required(),
}), {allowUnknown: true});

const commitLocations = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('location');
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const {locations, driveId} = validated.value;
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

export default module.exports = commitLocations;