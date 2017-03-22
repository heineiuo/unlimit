import Joi from 'joi'
import {connect, bindActionCreators} from '../../utils/tools'
import destroyLocation from '../location/remove'

/**
 * @api {POST} /Host/delete删除host
 * @apiGroup Host
 * @apiName HostDelete
 * @apiParam {string} hostname
 */
const remove = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);


    const db = ctx.db.host;
    const {destroyLocation} = getAction();
    const {hostname} = query;
    await Promise.all([
      db.del(hostname),
      destroyLocation({hostname})
    ]);
    resolve({})
  } catch (e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    destroyLocation
  })
)(remove);