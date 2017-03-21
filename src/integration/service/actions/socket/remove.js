import {connect, bindActionCreators} from '../../../tools'
import updateGroup from '../group/update'

/**
 * delete socket
 */
const remove = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {socketId} = query;
    const db = ctx.db.socket;
    const {getGroup, updateGroup} = getAction();
    const socketInfo = await db.get(socketId);
    await db.del(socketId);
    const group = await getGroup({appName: socketInfo.appName});
    group.list = group.list.map(item => {
      if (item.appId == socketInfo.appId) {
        item.socketId = '';
        item.status = 0
      }
      return item
    });
    await updateGroup({appName: socketInfo.appName, group});
    resolve(1)
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateGroup
  })
)(remove)