import Joi from 'joi'


const Get = ({hostname}) => (ctx) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.host;
    const host = await db.get(hostname);
    // console.log('host: '+ JSON.stringify(host));
    resolve(host)
  } catch (e) {
    if (e.name == 'NotFoundError') return reject(new Error('HOST_NOT_FOUND'));
    reject(e)
  }
});


export default module.exports = Get