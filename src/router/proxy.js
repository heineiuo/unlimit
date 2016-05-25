import {Router} from 'express'
import Host from '../model/host'
import Location from '../model/Location'
import parse from 'url-parse'
import httpProxy from 'http-proxy'
import _  from 'lodash'
import request from 'request'
import ent from 'ent'
import path from 'path'
import fs from 'fs-promise'

var conf = require('../conf')

const router = module.exports = Router()

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

router.use(async (req, res, next)=>{

  try {

    const locations = await Location.find({hostId: doc._id}).sort({sort: 1})
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

  } catch(e){
    next(e)
  }

})

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
        return res.sendStatus(502)
      }
      res.end()
    })


  } catch(e){
    next(e)
  }

})



router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'block') return next()
    res.redirect('http://www.google.com')

  } catch(e){
    next(e)
  }

})



router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'redirect') return next()
    res.redirect(location.content)

  } catch(e){
    next(e)
  }

})



router.use(async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'json') return next()
    return res.json(JSON.parse(location.content))

  } catch(e){
    next(e)
  }

})



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



router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'api') return next()
    var apiOptions = {
      method: 'POST',
      url: location.content,
      qs: req.query,
      form: _.extend(req.body, req.query, {
        appId: conf.appId,
        appSecret: conf.appSecret,
        proxyAppId: location.appId
      })
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
router.use(async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    next('UNDEFINED_TYPE')

  } catch(e){
    next(e)
  }

})