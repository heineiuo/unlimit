import updateApp from './mutateOne'
import Joi from 'joi'
import getMongodb from '../../mongodb'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appId: Joi.string().required(),
  appName: Joi.string().required()
}), {allowUnknown: true})


/**
 * delete a app and all related sockets
 * @returns {Promise}
 * @constructor
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appId, appName} = validated.value;

  try {
    const db = getCtx().leveldb.sub('app');
    const app = await db.get(appName);
    app.list = app.list.filter(item => item.appId !== appId);
    await dispatch(updateApp({appName, app}));
    resolve({})
  } catch(e){
    reject(e)
  }
});
