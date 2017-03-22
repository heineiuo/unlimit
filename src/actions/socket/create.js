import {connect, bindActionCreators} from "../../utils/tools"
import getApp from "../app/get"
import updateApp from "../app/update"

/**
 * 绑定app到socket /socket/add
 * @param query.socketId
 * @param query.registerInfo
 * @returns {Promise}
 */
const add = (query) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.socket;
    const {socketId, registerInfo: {appName, appId, appSecret}} = query;
    const {getApp, updateApp} = getAction();
    const app = await getApp({appName});
    const targetAppIndex = app.list.findIndex(item => {
      return item.appId == appId && item.appSecret == appSecret
    });
    if (targetAppIndex == -1) throw new Error('ERROR_REGISTER_INFO');
    const targetApp = Object.assign({}, app.list[targetAppIndex], {
      socketId: socketId,
      status: 1
    });
    await db.put(socketId, targetApp);
    app.list.splice(targetAppIndex, 1, targetApp);
    await updateApp({appName: app.appName, app});
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
)(add)