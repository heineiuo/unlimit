import {connect, bindActionCreators} from 'action-creator'
import updateApp from './update'

/**
 * delete a app and all related sockets
 * @param appId
 * @param appName
 * @returns {Promise}
 * @constructor
 */
const removeItem = ({appId, appName}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.sub('app');
    const app = await db.get(appName);
    const {updateApp} = getAction();
    app.list = app.list.filter(item => item.appId != appId);
    await updateApp({appName, app});
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateApp
  })
)(removeItem)