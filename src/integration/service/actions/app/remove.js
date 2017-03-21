

const remove = ({appId}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const db = ctx.db.app;
    await db.del(appId);
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = remove;