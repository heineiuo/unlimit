import {Router} from 'express'

/**
 * {host}/
 */
const router = module.exports = Router()

/**
 * 接口代理
 */
router.use(async (req, res, next) => {
  try {
    const {location, url, host} = res.locals
    if (location.type != 'API') return next('NOT_CLOUD_API')
    next()
  } catch(e){
    next(e)
  }
})


/**
 * 工具模块
 */
// 地理信息
router.use('/api/tool/geo', require('./tool/geo'))
// 测试模块
router.use('/api/tool/test', require('./tool/test'))

/**
 * 账号系统模块
 */
router.use('/api/account/account', require('./account/account'))
router.use('/api/account/role', require('./account/role'))
router.use('/api/account/role-type', require('./account/role-type'))
router.use('/api/account/user', require('./account/user'))

/**
 * 微信模块
 */
router.use('/api/wechat/receive', require('./wechat/receive'))
router.use('/api/wechat/menu', require('./wechat/menu'))
router.use('/api/wechat/kf', require('./wechat/kf'))
router.use('/api/wechat/media', require('./wechat/media'))
router.use('/api/wechat/jsapi', require('./wechat/jsapi'))
router.use('/api/wechat/account', require('./wechat/account'))
router.use('/api/wechat/auth', require('./wechat/auth'))

/**
 * 搜索模块
 */
router.use('/api/search', require('./search'))

/**
 * 设置模块
 */
router.use('/api/setting', require('./setting'))

/**
 * 任务流模块
 */
router.use('/api/task/task', require('./task/task'))

/**
 * 订单和支付模块
 */
router.use('/api/transaction/order', require('./transaction/order'))
router.use('/api/transaction/payment', require('./transaction/payment'))

/**
 * 公告,文章模块
 */
router.use('/api/cms/banner', require('./cms/banner'))
router.use('/api/cms/hire', require('./cms/hire'))
router.use('/api/cms/post', require('./cms/post'))

/**
 * 文件模块
 */
router.use('/api/file/upload', require('./file/upload'))


// 404

router.use('/api', (req, res, next) => {
  next('NOT_FOUND')
})

/**
 * 错误处理
 * 如果没有错误,返回404
 * 如果不是cloud_api, 交给下一个proxy模块处理
 * 否则,
 * 说明真有错,
 * 返回错误
 */
router.use(async (err, req, res, next) => {
  console.log(err.stack||err)
  if (err == 'NOT_FOUND') return res.json({error: 'NOT_FOUND'})
  if (err == 'NOT_CLOUD_API') return next()
  res.json({error: err})
})
