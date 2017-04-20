
import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})


/**
 * get app detail
 * @returns {Promise}
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const db = getCtx().leveldb.sub('app');
    const detail = await db.get(appName);
    resolve(detail)
  } catch(e){
    if (e.name !== 'NotFoundError') return reject('APP_NOT_CREATED');
    reject(e)
  }
});
