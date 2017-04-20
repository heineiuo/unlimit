import Joi from 'joi'
import getApp from "../app/queryLevelApp"
import updateApp from "../app/mutateOne"

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
export default (query) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const validated = validate(query);
    if (validated.error) return reject(validated.error);

    const db = getCtx().leveldb.sub('socket');
    const {socketId, registerInfo: {appName, appId, appSecret}} = query;
    const app = await dispatch(getApp({appName}));
    const targetAppIndex = app.list.findIndex(item => {
      return item.appId === appId && item.appSecret === appSecret
    });
    if (targetAppIndex === -1) return reject(new Error('ERROR_REGISTER_INFO'));
    const targetApp = app.list[targetAppIndex];
    targetApp.status = 1;
    targetApp.socketId = socketId;
    app.list.splice(targetAppIndex, 1, targetApp);
    await Promise.all([
      db.put(socketId, Object.assign({}, targetApp, {appName: appName})),
      dispatch(updateApp({appName: app.appName, app}))
    ]);
    const socketData = Object.assign({}, targetApp, {appName});
    resolve(socketData)
  } catch (e) {
    reject(e);
  }
});
