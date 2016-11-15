import Router from '../../router'
import {createRouter} from '../../spruce'

const router = new Router();

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

/**
 * router list
 */
router.use(createRouter(
  require('./socket'),
  require('./group'),
  require('./app')
));

/**
 * error handle
 */
router.use((err, req, res, next) => {
  if (typeof err == 'string') return res.error(err.toUpperCase());
  res.error('EXCEPTION_ERROR')
});

/**
 * 404 handle
 */
router.use((req, res) => {
  res.error('ROUTER_NOT_FOUND')
});

export default router
