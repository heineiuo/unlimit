import {Router} from 'express'

const proxy = (conf) => {

  const router = Router()

  router.use(require('./getHostAndLocation'))
  router.use(require('./handleCORS'))
  router.use(require('./handleFILE'))
  router.use(require('./handlePROXY'))
  router.use(require('./handleBLOCK'))
  router.use(require('./handleREDIRECT'))
  router.use(require('./handleJSON'))
  router.use(require('./handleHTML'))
  router.use(require('./handleAPI'))

  /**
   * 未定义的type类型
   */
  router.use((req, res, next)=>{
    next('UNDEFINED_TYPE')
  })

  /**
   * 处理proxy内遇到的异常和错误
   * `HOST_NOT_FOUND` 即没有错误, 交给http_server
   * `LOCATION_NOT_FOUND` 即404
   * `UNDEFINED_TYPE` 用户非法请求
   *
   * 其他 err交给全局err处理器
   */
  router.use(async (err, req, res, next)=>{

    if (err=='HOST_NOT_FOUND')
      return next()
    if (err=='LOCATION_NOT_FOUND')
      return res.end(`${req.headers.host}: LOCATION NOT FOUND`)
    if (err=='UNDEFINED_TYPE')
      return res.end(`${req.headers.host}: CONFIGURE ERROR`)
    if (err=='NOT_FOUND')
      return res.end(`${req.headers.host}: NOT FOUND`)
    
    return res.end(`${req.headers.host}: EXCEPTION ERROR`)
  })

  return router

}

module.exports = proxy
