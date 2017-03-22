

/**
 * get app detail
 * @returns {Promise}
 */
const get = ({appName}) => (ctx) => new Promise(async (resolve, reject) => {
  const db = ctx.db.app;

  try {
    const detail = await db.get(appName);
    resolve(detail)
  } catch(e){
    if (e.name != 'NotFoundError') return reject('APP_NOT_CREATED');
    reject(e)
  }
});

export default module.exports = get