import shouldNotFound from './shouldNotFound'
import batchLocations from '../location/batchLocation'
import Joi from 'joi'
import ent from 'ent'
import getHost from '../host/get'
import {connect, bindActionCreators} from '../../../tools'

/**
 * @api {POST} /Host/new 创建新的域名
 * @apiGroup Host
 * @apiName HostNew
 * @apiParam {string} hostname
 * @apiSuccess {string} hostname
 */
const New = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);


    const db = ctx.db.host;
    const {shouldNotFound, batchLocations} = getAction();
    const {hostname} = query;
    await shouldNotFound(hostname);
    await db.put(hostname, {hostname});
    await batchLocations({hostname, locations: {}, reset: true});
    resolve({hostname})
  } catch (e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    shouldNotFound, batchLocations
  })
)(New)