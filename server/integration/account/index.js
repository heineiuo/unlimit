import Router from '../../router'
import config from '../../utils/config'
import {createRouter} from '../../spruce'

const app = new Router();

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
app.use(require('./checkSession'));

/**
 * @api {POST} /account/session 获取session信息
 * @apiName Session
 * @apiGroup Account
 * @apiDescription 获取session信息
 * @apiParam {string} token 令牌
 * @apiSuccess {object} user
 */
app.use('/session', (req, res, next) => res.json(res.session));

app.use(createRouter(
  require('./Email'),
  require('./EmailCode'),
  require('./SSOCode'),
  require('./Token'),
  require('./User')
));

app.use((err, req, res, next) => {
  if (typeof err == 'string') return res.json({error: err});

  if (err.hasOwnProperty('name')) {
    if (err.name == 'ValidationError') return res.json({error: 'PARAM_ILLEGAL'})
  }

  if (err.hasOwnProperty('stack')) {
    if (err.stack.indexOf('Error: Command failed') > -1) return res.json({error: 'COMMAND_FAILED'})
  }

  console.log(err.stack||err);
  return res.json({error: "EXCEPTION_ERROR"})
});

app.use((req, res, next) => {
  res.json({error: 'NOT_FOUND'})
});


export default module.exports = app
