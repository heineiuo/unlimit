import Joi from 'joi'
import ent from 'ent'




/**
 * @api {POST} /Location/delete 删除一个location
 * @apiGroup Location
 * @apiName LocationDelete
 * @apiParam {string} token 令牌
 * @apiParam {string} driveId
 * @apiParam {string} pathname
 */
const removeItem = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {

    const validated = Joi.validate(query, Joi.object().keys({
      driveId: Joi.string().required(),
      pathname: Joi.string().required()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);

    const db = getCtx().leveldb.sub('location');
    const {driveId, pathname} = validated.value;
    const location = await db.get(driveId);
    delete location.locations[pathname];
    await db.put(driveId, location);
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = removeItem