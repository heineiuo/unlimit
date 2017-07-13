/* @public */
import Joi from 'joi';

export const validate = query => Joi.validate(query, Joi.object().keys({
  appId: Joi.string().required(),
}), {allowUnknown: true});

export default query => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appId} = validated.value;
  const {getLeveldb} = getCtx()
  try {
    const {appName, app} = query;
    const db = (await getLeveldb()).sub('app');
    await db.put(appName, app);
    resolve({success: 1});

  } catch(e){
    reject(e)
  }
})
