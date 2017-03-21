import {connect, bindActionCreators} from '../../../tools'

import getApp from '../app/get'
import getGroup from '../group/get'
import list from '../socket/list'
import listGroup from '../group/list'
import updateGroup from '../group/update'

/**
 * empty all sockets records
 * @returns {Promise}
 */
const empty = () => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.socket;
    const {list, listGroup} = getAction();
    const sockets = await list();
    await Promise.all(sockets.map(item => db.del(item._key)));
    const groups = await listGroup();
    await Promise.all(groups.map(group => {
      group.list = group.list.map(item => ({
        appId: item.appId,
        socketId: "",
        status: 0
      }));
      return updateGroup({appName: group._key, group})
    }));
    resolve()
  } catch(e){
    reject(e);
  }
});


export default module.exports = connect(
  bindActionCreators({
    getApp,
    getGroup,
    updateGroup,
    list,
    listGroup
  })
)(empty)