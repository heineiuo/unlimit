import {Router} from 'seashell-client-node'
import {combineReducers} from 'sprucejs'


export default module.exports = (name, db) => {

  const app = new Router();
  const handler = combineReducers([
    require('./Email'),
    require('./EmailCode'),
    require('./SSOCode'),
    require('./Token'),
    require('./User')
  ])(db);

  app.use((req, res, next) => {
    res.app = app;
    res.json = (data) => {
      res.body = data;
      res.end()
    };
    next()
  });


  /**
   * 通用中间件
   * 检查session, 并把session传递给下面的中间件
   */
  app.use(async(req, res, next) => {
    req.body.session = {
      user: null
    };

    try {
      if (!req.body.hasOwnProperty('token')) return next();
      const user = await handler({
        reducerName: 'token',
        action: 'session',
        token: req.body.token
      });
      req.body.session = {user};
      next()
    } catch(e){
      if (e.message == 'SESSION_EMPTY') return next();
      next(e)
    }
  });

  app.use(async (req, res, next) => {
    if (!req.body.hasOwnProperty('reducerName')) throw new Error('PARAM_ILLEGAL');
    const result = await handler(req.body);
    res.json(result)
  });


  app.use((err, req, res, next) => {
    if (err.name == 'ValidationError') return res.json({error: 'PARAM_ILLEGAL'});
    if (err.message == 'Command failed') return res.json({error: 'COMMAND_FAILED'});
    return res.json({error: err.message});
  });

  app.use((req, res, next) => {
    res.json({error: 'NOT_FOUND'})
  });

  return {
    name,
    router: app,
    handler,
  }
}
