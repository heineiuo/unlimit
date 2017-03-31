
const ShouldNotFound = ({appName}) => (dispatch, getCtx) => new Promise(async(resolve, reject) => {
  try {
    const db = getCtx().db.sub('app');
    await db.get(appName);
    reject(new Error('APP_HAS_EXIST'));
  } catch (e) {
    if (e.name === 'NotFoundError') return resolve();
    reject(e)
  }
});

export default ShouldNotFound