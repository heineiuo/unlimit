import Joi from 'joi'
import ent from 'ent'
import getHost from '../host/get'
import {connect, bindActionCreators} from '../../utils/tools'

/**
 * @api {POST} /location/batch 批量设置
 * @apiGroup Location
 * @apiName LocationBatch
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} locations
 * @apiSuccess {number} success
 */
const batch = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      locations: Joi.object().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {hostname, locations, reset=false} = query;
    const {getHost} = getAction();
    await getHost(hostname);
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

export default module.exports = connect(
  bindActionCreators({
    getHost
  })
)(batch)