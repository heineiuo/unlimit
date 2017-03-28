import Joi from 'joi'
import ent from 'ent'
import {connect, bindActionCreators} from 'action-creator'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  hostname: Joi.string().required(),
  locations: Joi.array().required(),
}), {allowUnknown: true});

const commitLocations = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.location;
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const {locations, hostname} = validated;
    const location = await db.get(hostname);
    location.users = [ctx.request.headers.session.userId];
    location.hostname = hostname;
    location.locations = locations;
    await db.put(hostname, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }
});

export default module.exports = commitLocations;