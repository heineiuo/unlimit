import uuid from 'uuid'
import crypto from 'crypto'
import Joi from 'joi'
import getMongodb from '../../mongodb'

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
    const nextService = {
      appId: uuid.v1(),
      appName: appName,
      appSecret: createSecret().toString(10)
    };

    const app = await dispatch(getApp({appName}));
    app.list.push({
      appId: nextService.appId,
      appSecret: nextService.appSecret,
      socketId: '',
      status: 0,
    });

    await dispatch(updateApp({appName, app}));
    resolve(nextService)
  } catch(e) {
    reject(e)
  }
});

