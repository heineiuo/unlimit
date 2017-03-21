import {connect, bindActionCreators} from '../../../tools'
import getApp from '../app/get'
import getGroup from '../group/get'
/**
 * Socket
 * socket_${socketId}:
 *  {
   *   appId: 'aaa-fag-gafd123f-g123123-fda-123',
   *   appName: 'account',
   *   permission: ['admin'],
   *   socketId: 'ccc'
   *  }
 *
 */

/**
 * get socket by appId
 * @returns {Promise}
 */
const get = ({appId}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.socket;
    const {getApp, getGroup} = getAction();
    const app = await getApp({appId});
    const group = await getGroup({appName: app.appName});
    const targetAppIndex = group.list.findIndex(item => item.appId == appId);
    if (targetAppIndex < 0) throw new Error('APP_NOT_FOUND');
    const socket = await db.get(group.list[targetAppIndex].socketId);
    resolve(socket)
  } catch(e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    getApp,
    getGroup
  })
)(get)