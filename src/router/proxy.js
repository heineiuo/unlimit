import {Router} from 'express'
import parse from 'url-parse'
import httpProxy from 'http-proxy'
import _  from 'lodash'
import request from 'request'
import ent from 'ent'
import path from 'path'
import fs from 'fs-promise'

import Host from '../model/host'
import Location from '../model/location'

const router = module.exports = Router()

/**
 * 查询host
 */
router.use(async (req, res, next)=>{

  try {
    const host = await Host.findOne({hostname: req.headers.host})
    if (!host) return next('HOST_NOT_FOUND')
    res.locals.host = host
    next()

  } catch(e){
    next(e)
  }

})

/**
 * 查询location
 */
router.use(async (req, res, next)=>{

  try {

    const {host} = res.locals
    Location.find({hostId: host._id}).sort({sort: 1}).exec((err, locations)=>{
      if (err) return next(err)
      
      if (locations.length==0) return next('LOCATION_NOT_FOUND')

      // 获取url, 自动补上'/'
      var url = res.locals.url = parse(req.headers.host + req.url , true)
      if (url.pathname =='') url.pathname = '/'

      // 通过比对pathname, 找到路由
      // todo
      // 需要根据排序执行
      var found = false
      _.forEach(locations, (item, index)=> {
        var reg = new RegExp(_.trim(item.pathname, '/').replace('\\\\','\\'))
        var matches = url.pathname.match(reg)
        if (matches && matches[0] == url.pathname) {
          res.locals.location = item
          found = true
          return false
        }
      })


      if (!found) return next('LOCATION_NOT_FOUND')
      next()
    })
    

  } catch(e){
    next(e)
  }

})

/**
 * 允许跨域
 */
router.use(async (req, res, next)=>{
  try {
    if (res.locals.location.cors == 'true'){
      res.set('Access-Control-Allow-Origin', '*')
    }
    next()
  } catch(e){
    next(e)
  }
})

/**
 * 文件代理
 */
router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'file') return next()

    var filePath = path.join(location.content, url.pathname)

    return res.sendFile(filePath, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Expires': new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 一年
      }
    }, function (err) {
      if (err && !res.headersSent) {
        var lastParam = url.pathname.split('/').pop()
        if (lastParam.length && !/\./.test(lastParam)) {
          res.redirect(req.path+'/')
        } else {
          res.sendStatus(404)
        }
      }
    })


  } catch(e){
    next(e)
  }

})

/**
 * 反向代理
 */
router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'proxy') return next()

    // todo handle ssl cert to options
    var options = {
      // protocolRewrite: 'http'
    }
    var target = location.content
    httpProxy.createProxyServer(options).web(req, res, {
      target: target,
      ssl: {
        key: fs.readFileSync('/etc/letsencrypt/live/'+req.headers.host+'/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/'+req.headers.host+'/cert.pem', 'utf8')
      }
    }, function (err) {
      if (err) {
        console.log(err)
        return next(err)
      }
      res.end()
    })


  } catch(e){
    next(e)
  }

})


/**
 * 黑名单域名
 */
router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'block') return next()
    res.redirect('http://www.google.com')

  } catch(e){
    next(e)
  }

})


/**
 * 重定向
 */
router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'redirect') return next()
    res.redirect(location.content)

  } catch(e){
    next(e)
  }

})


/**
 * 返回json
 */
router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'json') return next()
    return res.json(JSON.parse(location.content))

  } catch(e){
    next(e)
  }

})


/**
 * 返回html
 */
router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals

    if (location.type == 'html') return next()
    if (location.contentType=='file'){
      res.sendFile(location.content, {
        headers: {
          'Expires': new Date(Date.now() + 1000 * 10) // 10s
        }
      }, function (err) {
        if (err && !res.headersSent) res.sendStatus(404)
      })
    } else {
      res.end(ent.decode(location.content))
    }

  } catch(e){
    next(e)
  }

})


/**
 * 接口代理
 */
router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'api') return next()
    var apiOptions = {
      method: 'POST',
      url: location.content,
      qs: req.query
    }
    request(apiOptions, function(err, response, body){
      if (err) {
        console.log('请求外部接口失败')
        console.log(err)
        return res.sendStatus(500)
      }
      try {
        res.json(JSON.parse(body))
      } catch(e){
        console.log(body)
        res.sendStatus(502)
      }
    })


  } catch(e){
    next(e)
  }

})



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

  if(err=='HOST_NOT_FOUND'){
    return next()
  }
  if (err=='LOCATION_NOT_FOUND'){
    return res.end(`${req.headers.host}: LOCATION NOT FOUND`)
  }
  if(err=='UNDEFINED_TYPE'){
    return res.end(`${req.headers.host}: CONFIGURE ERROR`)
  }

  return res.end(`${req.headers.host}: EXCEPTION ERROR`)
})