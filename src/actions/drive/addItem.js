import {connect, bindActionCreators} from 'action-creator'
import Joi from 'joi'
import ent from 'ent'


/**
 * @api {POST} /drive/new 创建一条location记录
 * @apiGroup Location
 * @apiName LocationNew
 * @apiParam {string} token 令牌
 * @apiParam {string} hostname
 * @apiParam {string} pathname
 * @apiParam {boolean} cors
 * @apiParam {string} type
 * @apiParam {string} [contentType]
 * @apiParam {string} content
 */
const New = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      cors: Joi.boolean(),
      type: Joi.string().required(),
      contentType: Joi.string(),
      content: Joi.string().required()
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);


    const db = ctx.db.location;
    const {hostname, type, cors=false, pathname, content, contentType='text'} = query;
    const encodedContent = type == 'html'? ent.encode(content) :content;
    const location = await db.get(hostname);
    const nextLocation = {
      pathname,
      cors,
      sort: Object.keys(location.locations).length + 1,
      type,
      contentType,
      content: encodedContent,
    };

    location.locations[pathname] = nextLocation;
    await db.put(hostname, location);
    resolve({nextLocation})
  } catch(e){
    reject(e);
  }
});

export default module.exports = connect(
  bindActionCreators({
  })
)(New)
