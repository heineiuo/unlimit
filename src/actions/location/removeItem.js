import {connect, bindActionCreators} from '../../utils/tools'
import Joi from 'joi'
import ent from 'ent'




/**
 * @api {POST} /Location/delete 删除一个location
 * @apiGroup Location
 * @apiName LocationDelete
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 */
const removeItem = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {

    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {hostname, pathname} = query;
    const location = await db.get(hostname);
    delete location.locations[pathname];
    await db.put(hostname, location);
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = removeItem