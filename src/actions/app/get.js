

/**
 * get app detail
 * @returns {Promise}
 */
const get = ({appName}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const db = getCtx().db.sub('app');

  try {
    const detail = await db.get(appName);
    resolve(detail)
  } catch(e){
    if (e.name !== 'NotFoundError') return reject('APP_NOT_CREATED');
    reject(e)
  }
});

export default module.exports = get