import express from 'express'
import paramRule from '../lib/param-rule'
import awaitify, {awaitify2} from '../lib/awaitify'
import WeChatSDK from 'wechat-mp-sdk'

import User from '../model/User'
import Admin from '../model/Admin'
import UserFromWechat from '../model/UserFromWechat'

// const needSignature = paramRule.Rule('signature', 'query', 'has')
// const needTimestamp = paramRule.Rule('timestamp', 'query', 'has')
// const needNonce = paramRule.Rule('nonce', 'query', 'has')
// const needEchostr = paramRule.Rule('echostr', 'query', 'has')

const router = module.exports = express.Router()



router.use(function(req, res, next){

  try {
    res.locals.wechatsdk = WeChatSDK(res.locals.weixinConfig)
    next()
  } catch(e){
    next(e)
  }
})


/**
 * router list
 */
router.route('/list').get(async function(req, res, next){

  try {

    console.log(req.query)
    const admin = await Admin.getAdminByToken(req.query.youkuohao_token)
    const list = await UserFromWechat.list(req.query)

    res.json({list: list})

  } catch(e){
    next(e)
  }
})

router.route('/list/total').get(async function(req, res, next){

  try {
    console.log(req.query)

    const admin = await Admin.getAdminByToken(req.query.youkuohao_token)
    const total = await UserFromWechat.count({isDeleted: {$ne: true}})
    res.json({
      total: total
    })

  } catch(e){
    next(e)
  }
})


/**********
 *
 * 接收消息模块
 *
 *********/

// 消息验证
router.route('/receive').get(async function (req, res, next) {

  try {
    const sdk = res.locals.wechatsdk
    const checkResult = await sdk.core.receiveCheck(req.query)
    res.send(checkResult)
  } catch(e){
    next(e)
  }

})

// 接收消息
router.route('/receive').post(async function (req, res, next) {

  try {
    const sdk = res.locals.wechatsdk
    const parsed = await sdk.core.receiveMsg(req.body)

    // todo 处理自动回复和转发到客服
    res.send('success')

  } catch(e){
    next(e)
  }

})



/**************
 *
 * 菜单模块
 *
 ************/

// 获取菜单
router.route('/menu/get').get(async function(req, res, next){

  try {
    const sdk = res.locals.wechatsdk

    var menuData = await sdk.menu.getMenu()
    res.json(menuData)
  } catch(e){
    next(e)
  }

})

// 创建菜单
router.route('/menu/create').post(async function(req, res, next){

  try {
    const sdk = res.locals.wechatsdk
    var menuData = await sdk.menu.createMenu(req.body)
    res.json(menuData)
  } catch(e){
    next(e)
  }

})


/***********
 *
 * 客服模块
 *
 **********/

// 发送消息
router.route('/kf/sendMsg').get(async function(req, res, next){

  try {
    res.json({})
  } catch(e){
    next(e)
  }

})

/***************
 *
 * 素材模块
 *
 **************/

// 获取永久素材列表
router.route('/media/material/list').get(async function(req, res, next){
  try {
    const sdk = res.locals.wechatsdk
    const list = await sdk.media.getMaterialList(req.query)
    res.json(list)

  } catch(e){
    next(e)
  }
})



/********************
 *
 * 账号模块
 *
 *******************/
// require param: code
router.route('/login').post(async function(req, res, next){

  try {
    const sdk = res.locals.wechatsdk
    const code = req.body.code
    const accessTokenPack = await sdk.auth.getUserAccessToken(code)
    const userinfo = await sdk.auth.getUserInfo({
      access_token: accessTokenPack.access_token,
      openid: accessTokenPack.openid
    })

    /**
     * 如果没有过账户, 自动创建一个
     * 然后更新UserFromWechat的记录
     * 然后从User获取fudiToken
     * 返回fudiToken
     */
    accessTokenPack.userinfo = userinfo
    const youkuohao_token = await UserFromWechat.updateInfoAndGetToken(accessTokenPack)
    res.json({
      youkuohao_token: youkuohao_token,
      type: 'wechat',
      userinfo: userinfo
    })

  } catch(e){
    next(e)
  }
})


/***
 * jsapi模块
 */


router.route('/jsapi/signature').get(async function(req, res, next){
  try {
    const sdk = res.locals.wechatsdk

    res.json({
      signature: '',
      url: '',
    })
  } catch(e){
    next(e)
  }
})

