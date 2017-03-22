const destroy = ({hostname}) => (ctx) => new Promise(async (resolve) => {
  try {
    await ctx.db.location.del(hostname)
    resolve({})
  } catch(e){
    reject(e)
  }
});

export default module.exports = destroy