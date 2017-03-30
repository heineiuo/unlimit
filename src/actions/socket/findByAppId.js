import {connect, bindActionCreators} from 'action-creator'
import getApp from '../app/get'
/**
 * Socket
 * socket_${socketId}:
 *  {
   *   appId: 'aaa-fag-gafd123f-g123123-fda-123',
   *   appName: 'account2',
   *   permission: ['admin'],
   *   socketId: 'ccc'
   *  }
 *
 */

/**
 * get socket by appId
 * @returns {Promise}
 */
const findByAppId = ({appName, appId}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.sub('socket');
    const { getApp} = getAction();
    const app = await getApp({appName: appName});
    const targetAppIndex = app.list.findIndex(item => item.appId == appId);
    if (targetAppIndex < 0) throw new Error('APP_NOT_FOUND');
    const socket = await db.get(app.list[targetAppIndex].socketId);
    resolve(socket)
  } catch(e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    getApp
  })
)(findByAppId)