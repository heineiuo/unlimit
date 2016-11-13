import Router from '../../utils/router'
import config from '../../utils/config'

const app = new Router();

app.use((req, res, next) => {
  res.app = app
  res.json = (data) => {
    res.body = data
    res.end()
  }
  next()
})


/**
 * 通用中间件
 * 检查session, 并把session传递给下面的中间件
 */
app.use(require('./checkSession'))

/**
 * 用户操作
 *
 * 返回session信息 /session
 * 发送验证码到指定邮箱, 用于登录(获取token) /email-code/login
 * 通过邮箱验证码登录  /login/email-code
 * 通过单点登录授权码登录 /login/sso-code
 * 登出 /logout
 */
app.use('/session', (req, res, next) => res.json(res.session));

// app.use('/email-code/login', require('./sendEmailCode'))
// app.use('/login/email-code', require('./getTokenByEmailCode'))
// app.use('/login/sso-code', require('./getTokenBySSOCode'))
// app.use('/logout', require('./logout'))

/**
 * 这些需要登录
 * 获取单点登录授权码, 用于登录(获取token)  /sso-code
 */
// app.use('/sso-code', require('./getSSOCode'))

/**
 * 以下需要管理员
 */
app.use((req, res, next) => {
  if (!res.session.user) throw 'ERR_NOT_LOGGED'
  if (res.session.user.email != 'heineiuo@gmail.com') throw 'PERMISSION_DENIED'
  next()
})

/**
 * 管理
 * 获取用户列表 /manage/list
 */
// app.use('/manage/list', require('./manageList'))
// app.use('/manage/list/empty', require('./manageListEmpty'))


app.use((err, req, res, next) => {
  console.log(err.stack||err)
  res.json({error: err})
})

app.use((req, res, next) => {
  res.json({error: 'NOT_FOUND'})
})

const start = () => {
  app.connect(config.seashell)
  console.log(app)
}

if (config.start) {
  start()
}

export default module.exports = app
