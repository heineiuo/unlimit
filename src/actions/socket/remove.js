import {connect, bindActionCreators} from '../../utils/tools'
import updateApp from '../app/update'

/**
 * delete socket
 */
const remove = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {socketId} = query;
    const db = ctx.db.socket;
    const {updateApp} = getAction();
    const socketInfo = await db.get(socketId);
    await db.del(socketId);
    const app = await updateApp({appName: socketInfo.appName});
    app.list = app.list.map(item => {
      if (item.appId == socketInfo.appId) {
        item.socketId = '';
        item.status = 0
      }
      return item
    });
    await updateApp({appName: socketInfo.appName, app});
    resolve(1)
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateApp
  })
)(remove)