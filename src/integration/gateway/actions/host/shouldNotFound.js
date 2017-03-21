
const ShouldNotFound = (key) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.host;
    await db.get(key);
    reject(new Error('HOST_EXIST'));
  } catch (e) {
    if (e.name == 'NotFoundError') return resolve();
    reject(e)
  }
});

export default ShouldNotFound