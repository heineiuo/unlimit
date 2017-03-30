import Joi from 'joi'
import {connect, bindActionCreators} from "action-creator"
import getApp from "../app/get"
import updateApp from "../app/update"

const validate = (query) => Joi.validate(query, Joi.object().keys({
  socketId: Joi.string().required(),
  registerInfo: Joi.object().required(),
}), {allowUnknown: true});

/**
 * 绑定app到socket /socket/add
 * @param query.socketId
 * @param query.registerInfo
 * @returns {Promise}
 */
const bind = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const db = ctx.db.sub('socket');
    const {socketId, registerInfo: {appName, appId, appSecret}} = query;
    const {getApp, updateApp} = getAction();
    const app = await getApp({appName});
    const targetAppIndex = app.list.findIndex(item => {
      return item.appId == appId && item.appSecret == appSecret
    });
    console.log(query);
    if (targetAppIndex == -1) return reject(new Error('ERROR_REGISTER_INFO'));
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
)(bind)