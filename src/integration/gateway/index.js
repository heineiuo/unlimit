import {Router} from 'seashell-client-node'
import {combineReducers} from 'sprucejs'

const createApp = (name, db) => {

  const app = new Router();

  const handleRequest = combineReducers([
    require('./File'),
    require('./Host'),
    require('./Location')
  ])(db);

  app.use((req, res, next) => {
    res.app = app;
    res.json = (data) => {
      res.body = data;
      res.end()
    };
    res.error = (error) => res.json({error});
    next()
  });

  // app.use(async (req, res, next) => {
  //
  //   const {token} = req.body;
  //   if (!token) throw new Error('PERMISSION_DENIED');
  //   const {body} = await app.request('/account/session', {token});
  //   if (body.error || body.user == null) throw new Error('PERMISSION_DENIED');
  //   res.session = body;
  //   next()
  // });

  app.use(async (req, res, next) => {

    const {reducerName} = req.body;
    if (!reducerName) return next(new Error('PARAM_ILLEGAL'));
    req.body.setHeader = (header) => {
      Object.assign(res.headers, header);
    };
    const result = await handleRequest(req.body);
    res.json(result)
  });

  app.use((err, req, res, next) => {

    console.error(err);
    if (err.name == 'ValidationError') return res.error('PARAM_ILLEGAL');
    if (err.message == 'Command failed') return res.error('COMMAND_FAILED');

    return res.error(err.message);
  });

  app.use((req, res) => {
    res.error('NOT_FOUND')
  });

  return {
    name,
    handler: handleRequest,
    router: app
  };
};

export default module.exports = createApp