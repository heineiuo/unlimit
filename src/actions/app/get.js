

/**
 * get app detail
 * @returns {Promise}
 */
export default ({appName}) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const db = getCtx().leveldb.sub('app');

  try {
    const detail = await db.get(appName);
    resolve(detail)
  } catch(e){
    if (e.name !== 'NotFoundError') return reject('APP_NOT_CREATED');
    reject(e)
  }
});
