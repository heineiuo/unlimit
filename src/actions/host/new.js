import Joi from 'joi'
import {connect, bindActionCreators} from '../../utils/tools'

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
    const {hostname} = query;
    await db.put(hostname, {hostname});
    resolve({hostname})
  } catch (e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({})
)(New)