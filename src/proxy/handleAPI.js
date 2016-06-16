import {Router} from 'express'


const router = module.exports = Router()


/**
 * 接口代理
 */
router.use(async (req, res, next)=>{
  try {
    const {location, url} = res.locals
    if (location.type != 'API') return next('NOT_CLOUD_API')
    next()
  } catch(e){
    next(e)
  }
})


/**
 * 测试模块
 */
router.use('/api/test', require('./api/test'))

/**
 * 账号系统模块
 */
router.use('/api/account', require('./api/account'))
router.use('/api/role', require('./api/role'))
router.use('/api/role-type', require('./api/role-type'))
router.use('/api/user', require('./api/user'))

/**
 * 微信模块
 */
router.use('/api/wechat', require('./api/wechat'))
router.use('/api/auth', require('./api/auth'))

/**
 * 搜索模块
 */
router.use('/api/search', require('./api/search'))

/**
 * 设置模块
 */
router.use('/api/setting', require('./api/setting'))

/**
 * 任务流模块
 */
router.use('/api/task', require('./api/task'))

/**
 * 订单和支付模块
 */
router.use('/api/order', require('./api/order'))
router.use('/api/payment', require('./api/payment'))

/**
 * 公告,文章模块
 */
router.use('/api/banner', require('./api/banner'))
router.use('/api/hire', require('./api/hire'))
router.use('/api/post', require('./api/post'))

/**
 * 文件模块
 */
router.use('/api/file', require('./api/file'))

/**
 * 地理信息模块
 */
router.use('/api/geo', require('./api/geo'))

/**
 * 错误处理
 */
router.use(async (err, req, res, next) => {
  if (!err) return next()
  if (err == 'NOT_CLOUD_API') return next()
  res.json({error: err})
})

router.use(async (req, res) => {
  if (!res.headerSent) {
    res.json({error: 'NOT_FOUND'})
  }
})


