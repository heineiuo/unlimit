import ql from 'q-level'

const makeSubLevels = (db, list) => {
  const result = {};
  list.forEach(name => {
    result[name] = result[name.toLowerCase()] = ql(db.sublevel(name.toLowerCase()));
  });

  return result;
};


const bindActionCreators = (actionCreators) => {
  return (ctx) => {
    const p = {};
    Object.keys(actionCreators).forEach(actionCreatorName => {
      const actionCreator = actionCreators[actionCreatorName];
      const getActions = () => {};
      p[actionCreatorName] = (params) => actionCreator(params)(ctx, getActions)
    });
    return p
  }

};

const connect = (creators) => (main) => (...args) => (ctx, getActions) => {
  getActions = () => creators(ctx);
  return main(...args)(ctx, getActions)
};

export {
  connect,
  makeSubLevels,
  bindActionCreators
}