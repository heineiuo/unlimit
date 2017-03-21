import {connect, bindActionCreators} from '../../../tools'
import removeSocket from '../socket/remove'

/**
 * delete a group and all related sockets
 * @param groupName
 * @returns {Promise}
 * @constructor
 */
const remove = ({groupName}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.group;
    const {removeSocket} = getAction();
    const detail = await db.get(groupName);
    await Promise.all(detail.list.map(item => {
      return new Promise(async (resolve, reject) => {
        if (item.socketId == '') return resolve();
        try {
          await removeSocket({socketId: item.socketId});
          resolve()
        } catch(e){
          reject(e)
        }
      })
    }));
    await db.del(groupName);
    resolve()
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    removeSocket
  })
)(remove)