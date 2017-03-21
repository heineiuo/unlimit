import uuid from 'uuid'
import crypto from 'crypto'
import {connect, bindActionCreators} from '../../../tools'

import getGroupDetail from '../group/detail'
import updateGroup from '../group/update'

const createSecret = () => crypto.randomBytes(512).toString('hex');

/**
 * app create
 */
const create = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {appName} = query;
    const {updateGroup, getGroupDetail} = getAction();
    const db = ctx.db.app;
    const nextService = {
      appId: uuid.v1(),
      appName: appName,
      appSecret: createSecret().toString(10)
    };

    const group = await getGroupDetail(appName);
    group.list.push({
      appId: nextService.appId,
      socketId: '',
      status: 0,
    });

    await Promise.all([
      updateGroup({appName, group}),
      db.put(nextService.appId, nextService, {valueEncoding: 'json'})
    ]);

    resolve(nextService)
  } catch(e) {
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    getGroupDetail,
    updateGroup
  })
)(create)