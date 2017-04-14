import removeSocket from '../socket/unbind'

export default ({appName}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const db = getCtx().leveldb.sub('app');

  try {
    const detail = await db.del(appName);

    await Promise.all(detail.list.map(item => {
      return new Promise(async (resolve, reject) => {
        if (item.socketId === '') return resolve();
        try {
          await dispatch(removeSocket({socketId: item.socketId}));
          resolve()
        } catch(e){
          reject(e)
        }
      })
    }));

    resolve(detail||{})
  } catch(e){
    reject(e)
  }
});
