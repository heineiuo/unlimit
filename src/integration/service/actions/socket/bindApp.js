import {connect, bindActionCreators} from '../../../tools'
import getApp from '../app/get'
import getGroupDetail from '../group/get'
import updateGroup from '../group/update'

/**
 * 绑定app到socket
 * @param query.socketId
 * @param query.registerInfo
 * @returns {Promise}
 */
const bindApp = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {socketId, registerInfo} = query;
    const db = ctx.db.socket;
    const {getApp, getGroupDetail, updateGroup} = getAction();
    const app = await getApp(registerInfo.appId);
    if (app.appSecret != registerInfo.appSecret) throw new Error('ERROR_REGISTER_INFO');
    const socketData = Object.assign({}, app, {socketId: socketId});
    await db.put(socketId, socketData);
    const group = await getGroupDetail({appName: app.appName});
    const targetAppIndex = group.list.findIndex(item => item.appId == app.appId);
    group.list[targetAppIndex] = Object.assign(
      {},
      group.list[targetAppIndex],
      {
        socketId: socketId,
        status: 1
      }
    );
    await updateGroup({appName: app.appName, group});
    resolve(socketData)
  } catch(e){
    reject(e);
  }
});

export default module.exports = connect(
  bindActionCreators({
    getApp, getGroupDetail, updateGroup
  })
)(bindApp)