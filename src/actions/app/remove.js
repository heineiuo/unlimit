import {connect, bindActionCreators} from '../../utils/tools'
import removeSocket from '../socket/remove'

const remove = ({appName}) => (ctx) => new Promise(async (resolve, reject) => {
  const db = ctx.db.app;

  try {
    const detail = await db.del(appName);

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

    resolve(detail||{})
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    removeSocket
  })
)(remove)