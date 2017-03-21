
/**
 * 根据socketId获取app信息
 * @param query.socketId
 * @returns {Promise}
 */
const detail = (query) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const {socketId} = query;
    const db = ctx.db.socket;
    const socket = await db.get(socketId, {valueEncoding: 'json'});
    resolve(socket)
  } catch(e){
    if (e.name == 'NotFoundError') return reject(new Error('SOCKET_NOT_FOUND'));
    reject(e)
  }
});


export default module.exports = detail;