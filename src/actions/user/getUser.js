const Get = ({userId}) => (ctx, getAction) => {
  const db = ctx.db.sub('user');
  return db.get(userId)
};

export default module.exports = Get;