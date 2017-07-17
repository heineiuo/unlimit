import Joi from 'joi'
import mutateInsertOne from '../client/mutateInsertOne'


export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})


/**
 * app create
 */
export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;

  try {
    const {db} = getCtx()
    const {session} = getCtx().request.headers;
    if (!session) return reject(new Error('PERMISSION_DENIED'))
    const appDb = db.collection('app');
    const tokenDb = db.collection('apptoken');
    const app = await appDb.findOne({appName, adminId: session.userId});
    // if (app.adminId !== session.userId) return reject(new Error('PERMISSION_DENIED'));
    if (!app) return reject(new Error('APP_NOT_FOUNT'));
    const {token} = await dispatch(mutateInsertOne({
      id: app._id, type: 'app', name: appName
    }));
    const {permissions, adminId} = app;
    await tokenDb.insertOne({
      _id: token,
      token,
      updateTime: Date.now(),
      appName,
      adminId,
      permissions,
      appId: app._id
    })
    resolve({token})
  } catch(e) {
    reject(e)
  }
});

