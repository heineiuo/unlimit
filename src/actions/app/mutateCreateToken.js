import uuid from 'uuid'
import crypto from 'crypto'
import Joi from 'joi'
import getMongodb from '../../mongodb'
import getLeveldb from '../../leveldb'

import getApp from './queryLevelApp'
import updateApp from './mutateOne'

const createSecret = () => crypto.randomBytes(512).toString('hex');

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
    const {session} = getCtx().request.headers;
    console.log(session)
    if (!session) return reject(new Error('PERMISSION_DENIED'))
    const db = (await getMongodb()).collection('app');
    const tokendb = (await getLeveldb()).sub('apptoken');
    const app = await db.findOne({appName, adminId: session.userId});
    // if (app.adminId !== session.userId) return reject(new Error('PERMISSION_DENIED'));
    if (!app) return reject(new Error('APP_NOT_FOUNT'));
    const token = createSecret();
    const nextTokens = app.tokens ? app.tokens.concat([token]) : [token];
    const {permissions, adminId} = app;
    await tokendb.put(token, {
      updateTime: Date.now(),
      appName,
      adminId,
      permissions,
      appId: app._id.toString()
    })
    await db.findOneAndUpdate({_id: app._id}, {$set: {tokens: nextTokens}})
    resolve({token})
  } catch(e) {
    reject(e)
  }
});

