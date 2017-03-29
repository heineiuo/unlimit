/**
 * domain should not found in db
 * only one driveId can be bind to one domain
 * @param hostname
 * @constructor
 */
const ShouldNotFound = ({hostname}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.sub('domain');
    await db.get(hostname);
    reject(new Error('HOST_EXIST'));
  } catch (e) {
    if (e.name == 'NotFoundError') return resolve();
    reject(e)
  }
});

export default ShouldNotFound