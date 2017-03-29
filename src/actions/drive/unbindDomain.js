import Joi from 'joi'

const unbindDomain = (query) => (ctx, getAction) => new Promise(async (resolve, reject) => {
  try {
    const {hostname} = query;
    const db = ctx.db.sub('domain');
    await db.del(hostname);
    resolve({hostname})
  } catch(e){
    reject(e)
  }
});

export default module.exports = unbindDomain