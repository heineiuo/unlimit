import {connect, bindActionCreators} from 'action-creator'
import updateApp from '../app/update'
import Joi from 'joi'

/**
 * delete socket
 */
const remove = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object.keys({
      socketId: Joi.string().required()
    }));
    if (validated.error) return reject(validated.error);
    const {socketId} = validated.value;
    const db = ctx.db.sub('socket');
    const {updateApp} = getAction();
    const socketInfo = await db.get(socketId);
    await db.del(socketId);
    const app = await updateApp({appName: socketInfo.appName});
    app.list = app.list.map(item => {
      if (item.appId == socketInfo.appId) {
        item.socketId = '';
        item.status = 0
      }
      return item
    });
    await updateApp({appName: socketInfo.appName, app});
    resolve(1)
  } catch(e){
    reject(e)
  }
});

export default module.exports = connect(
  bindActionCreators({
    updateApp
  })
)(remove)