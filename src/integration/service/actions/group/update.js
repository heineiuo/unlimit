

const Put = ({appName, group}) => (ctx) => new Promise(async (resolve, reject) => {
  try {
    const result = await ctx.db.group.put(appName, group);
    resolve(result)
  } catch(e){
    if (e.name == 'NotFoundError') return reject(new Error('GROUP_NOT_FOUND'));
    reject(e)
  }
});

export default module.exports = Put;