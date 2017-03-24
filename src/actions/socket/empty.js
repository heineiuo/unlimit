import {connect, bindActionCreators} from 'action-creator'

import getApp from '../app/get'
import list from './list'
import listApp from '../app/list'
import updateApp from '../app/update'

/**
 * empty all sockets records
 * @returns {Promise}
 */
const empty = () => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.socket;
    const {listSocket, listApp} = getAction();
    const sockets = await listSocket({limit: null});
    await Promise.all(sockets.map(item => db.del(item._key)));
    const appList = await listApp({limit: null});
    await Promise.all(appList.map(app => {
      app.list = app.list.map(item => {
        return Object.assign({}, item, {
          socketId: "",
          status: 0
        })
      });
      return updateApp({appName: app.appName, app})
    }));
    resolve()
  } catch(e){
    reject(e);
  }
});


export default module.exports = connect(
  bindActionCreators({
    getApp,
    updateApp,
    list,
    listApp
  })
)(empty)