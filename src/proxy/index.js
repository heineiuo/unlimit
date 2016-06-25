import {Router} from 'express'
import Host from '../model/host'
import Location from '../model/location'
import parse from 'url-parse'
import _ from 'lodash'

module.exports = (config) => {

  const router = Router()

  /**
   * 查询host
   */
  router.use(async (req, res, next) => {
    try {
      res.locals.time1 = Date.now()

      if (req.headers.host == config.host) {
        res.locals.isCloud = true
        return next()
      }

      res.locals.isCloud = false

      const doc = await Host.findOne({hostname: req.headers.host})
      if (!doc) return next('HOST_NOT_FOUND')

      const locations = await Location.cfind({host_id: doc._id}).sort({sort: 1}).exec()
      if (locations.length==0) return next('LOCATION_NOT_FOUND')

      // 获取url, 自动补上'/'
      const url = res.locals.url = parse(req.headers.host + req.url , true)
      if (url.pathname =='') url.pathname = '/'

      // 通过比对pathname, 找到路由
      let found = false
      locations.some( item => {
        const reg = new RegExp(_.trim(item.pathname, '/').replace('\\\\','\\'))
        const matches = url.pathname.match(reg)
        if (matches && matches[0] == url.pathname) {
          item.type = item.type.toUpperCase()
          item.cors = 'ALLOW'
          res.locals.host = doc
          res.locals.location = item
          found = true
        }
        return found
      })

      if (!found) return next('LOCATION_NOT_FOUND')
      next()

    } catch(e){
      next(e)
    }

  })

  router.use(require('./cloud'))
  router.use(require('./cors'))
  router.use(require('./file'))
  router.use(require('./proxy'))
  router.use(require('./block'))
  router.use(require('./redirect'))
  router.use(require('./json'))
  router.use(require('./html'))

  /**
   * `api`是唯一一个自带路由的
   * 或许目前没有方法让用户自定义这一块的路由
   */
  router.use(require('./api'))

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

    res.locals.time2 = Date.now()
    console.log(res.locals.time2 - res.locals.time1 + 'ms, tag1')

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