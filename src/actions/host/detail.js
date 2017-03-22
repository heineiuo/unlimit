import Joi from 'joi'
import {connect, bindActionCreators} from '../../utils/tools'

/**
 * @api {POST} /Host/detail 获取域名详情
 * @apiGroup Host
 * @apiName HostDetail
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 */
const detail = (query) => (ctx) => new Promise(async(resolve, reject) => {
  try {
    const validate = Joi.validate(ctx.request.body, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const {db, reducers} = this.props;
    const {hostname} = ctx.request.body;
    const host = await this.Get(hostname);
    resolve({host})
  } catch (e) {
    reject(e)
  }
});

export default module.exports = detail;