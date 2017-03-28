import {connect, bindActionCreators} from 'action-creator'
import Joi from 'joi'
import ent from 'ent'


/**
 * @api {POST} /drive/list 获取location列表
 * @apiGroup Location
 * @apiName LocationList
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 * @apiSuccess {object} drive
 */
const get = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {

  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);
    const db = ctx.db.sub('location');
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