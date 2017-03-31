import removeSocket from '../socket/unbind'

const remove = ({appName}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const db = getCtx().db.sub('app');

  try {
    const detail = await db.del(appName);

    await Promise.all(detail.list.map(item => {
      return new Promise(async (resolve, reject) => {
        if (item.socketId === '') return resolve();
        try {
          await dispatch(removeSocket)({socketId: item.socketId});
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

export default module.exports = remove