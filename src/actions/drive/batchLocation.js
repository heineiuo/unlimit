import Joi from 'joi'
import ent from 'ent'
import {connect, bindActionCreators} from 'action-creator'

const validate = (query) => Joi.validate(query, Joi.object().keys({
  driveId: Joi.string().required(),
  locations: Joi.object().required()
}), {allowUnknown: true});

/**
 * @api {POST} /drive/batch 批量设置
 * @apiGroup Location
 * @apiName LocationBatch
 * @apiParam {string} token 令牌
 * @apiParam {string} driveId
 * @apiParam {string} locations
 * @apiSuccess {number} success
 */
const batch = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const db = ctx.db.sub('location');
    const {driveId, locations, reset=false} = validated.value;
    if (reset) {
      await db.put(driveId, {locations});
    } else {
      const location = await db.get(driveId);
      location.locations = locations;
      await db.put(driveId, location);
    }
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default batch