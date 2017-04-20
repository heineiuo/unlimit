import updateApp from '../app/mutateOne'
import Joi from 'joi'

/**
 * delete socket
 */
export default (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const validated = Joi.validate(query, Joi.object.keys({
      socketId: Joi.string().required()
    }));
    if (validated.error) return reject(validated.error);
    const {socketId} = validated.value;
    const db = getCtx().leveldb.sub('socket');
    const socketInfo = await db.get(socketId);
    await db.del(socketId);
    const app = await dispatch(updateApp({appName: socketInfo.appName}));
    app.list = app.list.map(item => {
      if (item.appId === socketInfo.appId) {
        item.socketId = '';
        item.status = 0
      }
      return item
    });
    await dispatch(updateApp({appName: socketInfo.appName, app}));
    resolve(1)
  } catch(e){
    reject(e)
  }
});