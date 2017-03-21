import {connect, bindActionCreators} from '../../../tools'
import Joi from 'joi'
import ent from 'ent'

import getHost from '../host/get'

/**
 * @api {POST} /location/list 获取location列表
 * @apiGroup Location
 * @apiName LocationList
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiSuccess {object} host
 * @apiSuccess {object} location
 */
const list = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {

  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);


    const db = ctx.db.location;

    const {hostname} = query;
    const {getHost} = getAction();
    const host = await getHost({hostname});
    const location = await db.get(hostname);
    resolve({host, location, hostname})
  } catch(e){
    reject(e)
  }

});

export default module.exports = connect(
  bindActionCreators({
    getHost
  })
)(list)