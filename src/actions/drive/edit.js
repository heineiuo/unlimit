import Joi from 'joi'
import ent from 'ent'

const edit = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {

    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      pathname: Joi.string().required(),
      cors: Joi.boolean(),
      type: Joi.string(),
      contentType: Joi.string(),
      content: Joi.string(),
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const db = getCtx().leveldb.sub('location');

    const {cors, driveId, type, content, contentType, pathname} = validated.value;
    const nextContent = (type === 'html' && contentType === 'text')?ent.encode(content):content;
    const location = await db.get(driveId);
    location.locations[pathname] = {
      pathname,
      cors,
      sort: location.locations[pathname].sort,
      type,
      contentType,
      content: nextContent
    };
    await db.put(driveId, location);
    resolve({success:1});
  } catch(e){
    reject(e)
  }

});

export default module.exports = edit