/* @private */

export default ({userId}) => (dispatch, getCtx) => {
  const db = getCtx().leveldb.sub('user');
  return db.get(userId)
};