const Get = ({userId}) => (dispatch, getCtx) => {
  const db = getCtx().leveldb.sub('user');
  return db.get(userId)
};

export default module.exports = Get;