import {App} from 'seashell'
import {bindActionCreators, makeSubLevels} from '../tools'
import createServer from './http'

const createApp = (db) => {

  const app = new App();
  const levels = makeSubLevels(db, ['File', 'Host', 'Location']);
  const allActionCreators = {
    fs: bindActionCreators({
      cat: require('./actions/fs/cat'),
      ls: require('./actions/fs/ls'),
      mkdir: require('./actions/fs/mkdir'),
      rename: require('./actions/fs/rename'),
      unlink: require('./actions/fs/unlink'),
      upload: require('./actions/fs/upload'),
      writeFile: require('./actions/fs/writeFile'),
    }),
    host: bindActionCreators({
      detail: require('./actions/host/detail'),
      get: require('./actions/host/get'),
      list: require('./actions/host/list'),
      new: require('./actions/host/new'),
      remove: require('./actions/host/remove'),
    }),
    location: bindActionCreators({
      batchLocations: require('./actions/location/batchLocation'),
      commitLocations: require('./actions/location/commitLocations'),
      list: require('./actions/location/list'),
      new: require('./actions/location/new')
    })
  };

  app.use((ctx, next) => {
    ctx.app = app;
    ctx.db = levels;
    ctx.json = (data) => {
      ctx.response.body = data;
      ctx.response.end()
    };
    ctx.setHeader = (header) => {
      Object.assign(ctx.response.headers, header);
    };
    ctx.error = (error) => ctx.json({error});

    ctx.on('error', (err) => {
      if (err.name == 'ValidationError') return ctx.error('PARAM_ILLEGAL');
      if (err.message == 'Command failed') return ctx.error('COMMAND_FAILED');

      return ctx.error(err.message);
    });

    ctx.on('end', () => {
      if (!ctx.state.isHandled) ctx.error('NOT_FOUND')
    });
    next()
  });

  app.use('/:moduleName/:actionName', async ctx => {
    const {moduleName, actionName} = ctx.request.params;
    if (!allActionCreators.hasOwnProperty(moduleName)) return ctx.error('NOT_FOUND');
    const actionCreators = allActionCreators[moduleName];
    const actions = actionCreators(ctx);
    if (!actions.hasOwnProperty(actionName)) return ctx.error('NOT_FOUND');
    const result = await actions[actionName](ctx.request.body);
    ctx.json(result)
  });

  return app
};

export default createApp
export {createServer}