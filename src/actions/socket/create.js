import Joi from 'joi'
import {connect, bindActionCreators} from "action-creator"
import getApp from "../app/get"
import updateApp from "../app/update"

/**
 * 绑定app到socket /socket/add
 * @param query.socketId
 * @param query.registerInfo
 * @returns {Promise}
 */
const create = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validate = Joi.validate(query, Joi.object().keys({
      socketId: Joi.string().required(),
      registerInfo: Joi.object().required(),
    }), {allowUnknown: true});

    if (validate.error) return reject(validate.error);

    const db = ctx.db.socket;
    const {socketId, registerInfo: {appName, appId, appSecret}} = query;
    const {getApp, updateApp} = getAction();
    const app = await getApp({appName});
    const targetAppIndex = app.list.findIndex(item => {
      return item.appId == appId && item.appSecret == appSecret
    });
    if (targetAppIndex == -1) throw new Error('ERROR_REGISTER_INFO');
    const targetApp = app.list[targetAppIndex];
    targetApp.status = 1;
    targetApp.socketId = socketId;
    app.list.splice(targetAppIndex, 1, targetApp);
    await Promise.all([
      db.put(socketId, Object.assign({}, targetApp, {appName: appName})),
      updateApp({appName: app.appName, app})
    ]);
    const socketData = Object.assign({}, targetApp, {appName});
    resolve(socketData)
  } catch (e) {
    reject(e);
  }
});

export default module.exports = connect(
  bindActionCreators({
     getApp, updateApp
  })
)(create)