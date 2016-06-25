import {Router} from 'express'

const router = Router()

/************
 *
 * 认证模块
 *
 ************/

/**
 * !未登录
 * 获取认证链接
 *
 * 流程:
 * 1. 客户端获取链接
 * 2. 客户端跳转到该链接(微信页面)
 * 3. 微信跳转回客户端(/connect/wechat),带code参数
 * 4. 客户端请求服务器, 发送code参数
 * 5. 服务端请求微信服务器,获取access_token
 * 6. 服务端生成fudi_token, 返回给客户端
 * 7. 此时,客户端仍然在/connect/wechat页面,页面上带有重定向参数
 * 8. 客户端保存fudi_token,并跳转到需要的重定向页面
 * 9. 客户端在新的页面, 通过fudi_token获取用户信息.
 */
router.route('/weixin/url').get(async function(req, res, next){
  try {

    const redirect_to = req.query.redirect_to || '/'
    const url = await seashell.import('wechat-mp', 'auth.generateUrl', {
      wechatConfig: res.locals.wechatConfig,
      redirectUrl: encodeURIComponent(
        'http://fudi.lh0519.com/connect/wechat?redirect_to='+redirect_to
      )
    })
    res.json(url)
  } catch(e){
    next(e)
  }

})

// !未登录
// 根据微信CODE获取fudi_token及用户信息
router.route('/weixin/code').get(async function(req, res, next){
  try {
    const sdk = WeChatSDK(res.locals.weixinConfig)
    console.log('[wechat sdk] getting userToken from wechat server...')
    const wechatUserToken = await sdk.auth.getUserAccessToken(req.query.code)
    console.log(wechatUserToken)
    console.log('[wechat sdk] getting user info from wechat server...')
    const wechatUserInfo = await sdk.auth.getUserInfo(wechatUserToken)
    console.log(wechatUserInfo)
    // 此处会更新用户信息
    const fudiUserInfo = await awaitify2(seashell).import('fudi-service', {
      actionName: 'login',
      type: 'wechat',
      wechatToken: wechatUserToken,
      wechatUserInfo: wechatUserInfo
    })

    res.json(fudiUserInfo)

  } catch(e){
    next(e)
  }
})


// 获取用户信息
// 根据fudi_token获取用户信息
// 如果是微信用户, 用户信息每10分钟和微信服务器同步
router.route('/userinfo').get(async function(req, res, next){
  res.json(res.locals.userinfo)
})

// 注销
router.route('/logout').get(async function(req, res, next){
  try {
    const logoutState = await awaitify2(seashell).import('fudi-service', {
      actionName: 'logout',
      fudi_token: req.query.fudi_token
    })
    res.json({success: 1})
  } catch(e){
    next(e)
  }
})

// !已登录

module.exports = router