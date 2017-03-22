const Get = ({userId}) => (ctx, getAction) => {
  return ctx.db.user.get(userId)
};

export default module.exports = Get;