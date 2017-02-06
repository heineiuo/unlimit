import {Router} from 'seashell-client-node'
import {combineReducers} from 'sprucejs'

export default (db) => {

  const router = new Router();

  const handler = combineReducers([
    require('./Socket'),
    require('./Group'),
    require('./App')
  ])(db);

  /**
   * add `res.json` method
   */
  router.use((req, res, next) => {
    res.json = (body) => {
      res.body = body;
      res.end()
    };
    res.error = (errCode) => {
      res.json({error: errCode})
    };
    next()
  });

  router.use(async (req, res, next) => {
    if (!req.body.hasOwnProperty('reducerName')) throw new Error('ILLEGAL_PARAMS');
    const result = await handler(req.body);
    res.json(result)
  });

  /**
   * error handle
   */
  router.use((err, req, res, next) => {
    res.error(err.message)
  });

  /**
   * 404 handle
   */
  router.use((req, res) => {
    res.error('ROUTER_NOT_FOUND')
  });

  return router
}
