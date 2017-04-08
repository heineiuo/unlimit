import Joi from 'joi'

const unbindDomain = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  try {
    const {hostname} = query;
    const db = getCtx().leveldb.sub('domain');
    await db.del(hostname);
    resolve({hostname})
  } catch(e){
    reject(e)
  }
});

export default module.exports = unbindDomain