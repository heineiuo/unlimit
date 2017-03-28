import Joi from 'joi'
import ent from 'ent'
import {connect, bindActionCreators} from 'action-creator'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  hostname: Joi.string().required(),
  locations: Joi.object().required()
}), {allowUnknown: true});

/**
 * @api {POST} /drive/batch 批量设置
 * @apiGroup Location
 * @apiName LocationBatch
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} locations
 * @apiSuccess {number} success
 */
const batch = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const db = ctx.db.location;
    const {hostname, locations, reset=false} = query;
    if (reset) {
      await db.put(hostname, {hostname, locations});
    } else {
      const location = await db.get(hostname);
      location.locations = locations;
      await db.put(hostname, location);
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default batch