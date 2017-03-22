
const ShouldNotFound = ({appName}) => (ctx, getAction) => new Promise(async(resolve, reject) => {
  try {
    const db = ctx.db.app;
    await db.get(appName);
    reject(new Error('APP_HAS_EXIST'));
  } catch (e) {
    if (e.name == 'NotFoundError') return resolve();
    reject(e)
  }
});

export default ShouldNotFound