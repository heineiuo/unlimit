import uuid from 'uuid'
import crypto from 'crypto'
import {connect, bindActionCreators} from 'action-creator'

import getApp from './get'
import Joi from 'joi'
import updateApp from './update'

const createSecret = () => crypto.randomBytes(512).toString('hex');

/**
 * app create
 */
const addItem = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object().keys({
      appName: Joi.string().required()
    }), {allowUnknown: true});
    if (validated.error) return reject(validated.error);
    const {appName} = validated.value;
    const {updateApp, getApp} = getAction();
    const nextService = {
      appId: uuid.v1(),
      appName: appName,
      appSecret: createSecret().toString(10)
    };

    const app = await getApp({appName});
    app.list.push({
      appId: nextService.appId,
      appSecret: nextService.appSecret,
      socketId: '',
      status: 0,
    });

    await updateApp({appName, app});
    resolve(nextService)
  } catch(e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    getApp,
    updateApp
  })
)(addItem)