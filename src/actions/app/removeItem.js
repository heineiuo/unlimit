import {connect, bindActionCreators} from 'action-creator'
import updateGroup from './update'

/**
 * delete a app and all related sockets
 * @param appId
 * @param appName
 * @returns {Promise}
 * @constructor
 */
const removeItem = ({appId, appName}) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.app;
    const app = await db.get(appName);
    const {updateGroup} = getAction();
    app.list = app.list.filter(item => item.appId != appId);
    await updateGroup({appName, app});
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateGroup
  })
)(removeItem)