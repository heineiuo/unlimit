import {Router} from 'express'
import httpProxy from 'http-proxy'
import request from 'request'
import ent from 'ent'
import path from 'path'
import fs from 'fs-promise'


const proxy = (conf) => {

  const router = Router()


  /**
   * 查询host
   */
  router.use(require('./getHost'))

  /**
   * 查询location
   */
  router.use(require('./getLocation'))

  /**
   * 允许跨域
   */
  router.use(async (req, res, next)=>{
    try {
      if (res.locals.location.cors == 'ALLOW'){
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
      if (location.type != 'FILE') return next()

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
      if (location.type != 'PROXY') return next()

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
      if (location.type != 'BLOCK') return next()
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
      if (location.type != 'REDIRECT') return next()
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
      if (location.type != 'JSON') return next()
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

      if (location.type != 'HTML') return next()
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
      if (location.type != 'API') return next()
      var apiOptions = {
        method: req.method,
        url: location.content,
        qs: req.query,
        body: req.body
      }
      request(apiOptions, function(err, response, body){
        if (err) {
          console.log('请求外部接口失败')
          console.log(err)
          return res.sendStatus(500)
        }
        console.log('请求外部接口成功')
        res.json(JSON.parse(body))

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

  return router

}

module.exports = proxy
