

const Get = ({groupName}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.socket.db;
    const result = await db.get(groupName);
    resolve(result)
  } catch(e){
    if (e.name == 'NotFoundError') return reject(new Error('GROUP_NOT_FOUND'));
    reject(e)
  }
});

export default module.exports = Get;