import {App} from 'seashell'
import chalk from 'chalk'
import {bindActionCreators, makeSubLevels} from '../tools'

const createService = (db) => {

  const app = new App();

  const allActionCreators = {
    group: bindActionCreators({
      detail: require('./actions/group/detail'),
      list: require('./actions/group/list'),
      remove: require('./actions/group/remove'),
      update: require('./actions/group/update'),
    }),
    socket: bindActionCreators({
      balance: require('./actions/socket/balance'),
      bindApp: require('./actions/socket/bindApp'),
      detail: require('./actions/socket/detail'),
      empty: require('./actions/socket/empty'),
      findAll: require('./actions/socket/list'),
      findByAppId: require('./actions/socket/get'),
      remove: require('./actions/socket/remove'),
    }),
    app: bindActionCreators({
      create: require('./actions/app/create'),
      list: require('./actions/app/list'),
      remove: require('./actions/app/remove'),
    })
  };

  const levels = makeSubLevels(db, ['App', 'Group', 'Socket']);

  app.use((ctx, next) => {
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
      console.error(chalk.red('[SEASHELL][INTEGRATE SERVICE] '+err.message));
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

export default createService;