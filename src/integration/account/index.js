import {App} from 'seashell'
import {bindActionCreators, makeSubLevels} from '../tools'


const actionCreators = bindActionCreators({
  session: require('./actions/session'),
  userList: require('./actions/userList'),
  checkCode: require('./actions/checkCode'),
  createCode: require('./actions/createCode'),
  createLoginCode: require('./actions/createLoginCode'),
  createToken: require('./actions/createToken'),
  getSSOCode: require('./actions/getSsoCode'),
  getTokenByEmailCode: require('./actions/getTokenByEmailCode'),
  getTokenBySSOCode: require('./actions/getTokenBySSOCode'),
  getUser: require('./actions/getUser'), // dev
  getUserIdWithUpset: require('./actions/getUserIdWithUpset'),
  logout: require('./actions/logout'),
  ssocodeGet: require('./actions/ssocodeGet')
});

export default module.exports = (db) => {

  const app = new App();
  const sublevels = makeSubLevels(db, ['Email', 'EmailCode', 'SSOCode', 'Token', 'User']);

  app.use((ctx, next) => {
    ctx.app = app;
    ctx.db = sublevels;
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

  app.use('/:actionName', async ctx => {
    const actions = actionCreators(ctx);
    const {actionName} = ctx.request.params;
    if (!actions.hasOwnProperty(actionName)) {
      return ctx.error('NOT_FOUND')
    }
    const action = actions[actionName];
    const result = await action(ctx.request.body);
    ctx.json(result)
  });


  return app
}
