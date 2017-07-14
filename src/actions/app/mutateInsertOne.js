/* @public */

/**
 * Create App Group
 */

import Joi from 'joi'

export const validate = query => Joi.validate(query, Joi.object().keys({
  appName: Joi.string().required()
}), {allowUnknown: true})

export default query => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = validate(query);
  if (validated.error) return reject(validated.error);
  const {appName} = validated.value;
  const {getMongodb} = getCtx()

  try {
    const {session} = getCtx().request.headers;
    if (!session) return reject(new Error('PERMISSION_DENIED'));
    const db = (await getMongodb()).collection('app');
    let app = await db.findOne({appName});
    if (app !== null) return reject(new Error('APP_NAME_EXIST'));

    app = (await db.insertOne({
      appName,
      permissions: [],
      adminId: session.userId
    })).ops[0]

    resolve({...app, appId: app._id.toString()})
  } catch(e){
    reject(e)
  }
});

