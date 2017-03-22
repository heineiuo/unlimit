

const update = ({appName, app}) => (ctx) => {
  return ctx.db.app.put(appName, app);
};

export default module.exports = update;