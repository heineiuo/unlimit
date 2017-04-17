/* @public */
import getLeveldb from '../../leveldb'
import Joi from 'joi';

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required(),
  app: Joi.object().required(),
}), {allowUnknown: true});

export default (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  try {
    const {appName, app} = query;
    const db = (await getLeveldb()).sub('app');
    await db.put(appName, app);
    resolve({success: 1});

  } catch(e){
    reject(e)
  }
})

