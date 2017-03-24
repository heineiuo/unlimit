import Joi from 'joi'
import ent from 'ent'
import {connect, bindActionCreators} from 'action-creator'


const commitLocations = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.location;
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      locations: Joi.array().required(),
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const {locations, hostname} = query;
    const location = await db.get(hostname);
    location.hostname = hostname;
    location.locations = locations;
    await db.put(hostname, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});

export default module.exports = commitLocations;