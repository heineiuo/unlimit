
import listSocket from './list'
import listApp from '../app/list'
import updateApp from '../app/update'

/**
 * empty all sockets records
 * @returns {Promise}
 */
export default () => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('socket');
    const sockets = await dispatch(listSocket({limit: null}));
    await Promise.all(sockets.map(item => db.del(item._key)));
    const appList = await dispatch(listApp({limit: null}));
    await Promise.all(appList.map(app => {
      app.list = app.list.map(item => {
        return Object.assign({}, item, {
          socketId: "",
          status: 0
        })
      });
      return dispatch(updateApp)({appName: app.appName, app})
    }));
    resolve()
  } catch(e){
    reject(e);
  }
});

