import Joi from 'joi'
import {connect, bindActionCreators} from 'action-creator'
import shouldNotFound from './shouldNotFound'
import commitLocations from './commitLocations'

/**
 * @api {POST} /Host/new 创建新的域名
 * @apiGroup Host
 * @apiName HostNew
 * @apiParam {string} hostname
 * @apiSuccess {string} hostname
 */
const create = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      locations: Joi.array().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {shouldNotFound, commitLocations} = getAction();
    const {hostname, locations} = query;
    await shouldNotFound({hostname});
    await db.put(hostname, {hostname});
    await commitLocations({hostname, locations});
    resolve({hostname})
  } catch (e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    shouldNotFound, commitLocations
  })
)(create)