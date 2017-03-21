import {connect, bindActionCreators} from '../../../tools'
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
const remove = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {

    const validate = Joi.validate(req, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);

    const db = ctx.db.location;
    const {hostname, pathname} = req;
    const location = await db.get(hostname);
    delete location.locations[pathname];
    await db.put(hostname, location);
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = remove