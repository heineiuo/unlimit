/* @public */
import Joi from 'joi';

export const validate = query => Joi.validate(query, Joi.object().keys({
  appId: Joi.string().required(),
}), {allowUnknown: true});

export default query => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appId} = validated.value;
  try {
    const {db} = getCtx()
    const {appName, app} = query;
    const appDb = db.collection('app');
    await appDb.findOneAndUpdate({_id: appName}, {$set: app});
    resolve({success: 1});

  } catch(e){
    reject(e)
  }
})
