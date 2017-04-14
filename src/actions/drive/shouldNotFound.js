// @private

/**
 * domain should not found in db
 * only one driveId can be bind to one domain
 * @param hostname
 * @constructor
 */
export default ({hostname}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const db = getCtx().leveldb.sub('domain');
    await db.get(hostname);
    reject(new Error('HOST_EXIST'));
  } catch (e) {
    if (e.name === 'NotFoundError') return resolve();
    reject(e)
  }
});
