import getApp from '../app/queryLevelApp'
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
export default ({appName, appId}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('socket');
    const app = await dispatch(getApp({appName: appName}));
    const targetAppIndex = app.list.findIndex(item => item.appId === appId);
    if (targetAppIndex < 0) throw new Error('APP_NOT_FOUND');
    const socket = await db.get(app.list[targetAppIndex].socketId);
    resolve(socket)
  } catch(e) {
    reject(e)
  }
});
