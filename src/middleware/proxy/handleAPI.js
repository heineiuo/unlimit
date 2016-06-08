import {Router} from 'express'

/**
 * 接口代理
 */

const router = Router()

router.use(async (req, res, next)=>{
  try {
    const {location, url} = res.locals
    if (location.type != 'API') return next('NOT_CLOUD_API')
    next()
  } catch(e){
    next(e)
  }
})
//
// router.use('/api/reporter', require('./api/reporter'))
// router.use('/api/message',  require('./api/message'))
// router.use('/api/product',  require('./api/product'))
// router.use('/api/payment',  require('./api/payment'))
// router.use('/api/setting',  require('./api/setting'))
// router.use('/api/search',   require('./api/search'))
// router.use('/api/banner',   require('./api/banner'))
// router.use('/api/wechat',   require('./api/wechat'))
// router.use('/api/staff',    require('./api/staff'))
// router.use('/api/order',    require('./api/order'))
// router.use('/api/admin',    require('./api/admin'))
// router.use('/api/user',     require('./api/user'))
// router.use('/api/task',     require('./api/task'))
// router.use('/api/post',     require('./api/post'))
// router.use('/api/auth',     require('./api/auth'))
// router.use('/api/file',     require('./api/file'))
// router.use('/api/hire',     require('./api/hire'))
// router.use('/api/geo',      require('./api/geo'))

router.use(async (err, req, res, next)=> {
  if (!err) return next('NOT_FOUND')
  if (err == 'NOT_CLOUD_API') return next()
  next(err)
})


module.exports = router