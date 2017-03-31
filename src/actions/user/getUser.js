const Get = ({userId}) => (dispatch, getCtx) => {
  const db = getCtx().db.sub('user');
  return db.get(userId)
};

export default module.exports = Get;