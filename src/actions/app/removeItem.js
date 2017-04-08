import updateApp from './update'

/**
 * delete a app and all related sockets
 * @param appId
 * @param appName
 * @returns {Promise}
 * @constructor
 */
const removeItem = ({appId, appName}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('app');
    const app = await db.get(appName);
    app.list = app.list.filter(item => item.appId !== appId);
    await dispatch(updateApp({appName, app}));
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = removeItem