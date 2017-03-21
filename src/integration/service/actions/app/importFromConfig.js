import {connect, bindActionCreators} from '../../../tools'

import getGroupDetail from '../group/detail'
import updateGroup from '../group/update'

/**
 * 导入service
 */
const importFromConfig = ({service}) => (ctx, getAction) => new Promise(async (resolve, reject) => {

  try {
    const db = ctx.db.app;
    const {updateGroup, getGroupDetail} = getAction();
    const group = await getGroupDetail({groupName: service.appName});
    const index = group.list.findIndex(item => {
      // console.log(item.appId, service.appId);
      return item.appId == service.appId
    });

    if (index > -1) return resolve(group.list[index]);

    const newService = {
      appId: service.appId,
      appName: service.appName,
      appSecret: service.appSecret
    };

    group.list.push({
      appId: newService.appId,
      socketId: null,
      status: 0,
    });

    await Promise.all([
      updateGroup({appName: service.appName, group}),
      db.put(newService.appId, newService)
    ]);

    resolve(newService)
  } catch(e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateGroup,
    getGroupDetail
  })
)(importFromConfig)