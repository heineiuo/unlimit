import {connect, bindActionCreators} from '../../utils/tools'
import Joi from 'joi'
import ent from 'ent'


/**
 * @api {POST} /location/list 获取location列表
 * @apiGroup Location
 * @apiName LocationList
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 * @apiSuccess {object} location
 */
const get = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {

  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {hostname} = query;
    const location = await db.get(hostname);
    resolve({location})
  } catch(e){
    reject(e)
  }

});

export default module.exports = connect(
  bindActionCreators({
  })
)(get)