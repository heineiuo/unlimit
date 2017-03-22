import Joi from 'joi'
import ent from 'ent'

const edit = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {

    const validate = Joi.validate(query, Joi.object().keys({
      hostname: Joi.string().required(),
      pathname: Joi.string().required(),
      cors: Joi.boolean(),
      type: Joi.string(),
      contentType: Joi.string(),
      content: Joi.string(),
    }), {allowUnknown: true});
    if (validate.error) return reject(validate.error);


    const db = ctx.db.location;

    const {cors, hostname, type, content, contentType, pathname} = query;
    const nextContent = (type == 'html' && contentType == 'text')?ent.encode(content):content;

    const location = await db.get(hostname);
    location.locations[pathname] = {
      pathname,
      cors,
      sort: location.locations[pathname].sort,
      type,
      contentType,
      content: nextContent
    };
    await db.put(hostname, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }

});

export default module.exports = edit;