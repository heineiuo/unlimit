import express from 'express'

const router = module.exports = express.Router()

/**
 * router list
 */
router.route('/list').get(async function(req, res, next){
  try {
    const {seashell, host} = res.locals
    await seashell.request('/account/admin/isadmin', {
      host_id: host._id,
      token: req.query.token
    })
    const list = await seashell.request('/wechat-mp/user/list', {
      host_id: host_id
    })
    res.json({list: list})
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
    const {seashell, host} = res.locals
    const {code} = req.body
    const accessTokenPack = await seashell.request('/core/get-user-access-token', {
      host_id: host._id,
      code: code
    })

    const userinfo = await seashell.request('/core/get-user-info', {
      host_id: host._id,
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
    const youkuohao_token = await seashell.request('core/UserFromWechat.updateInfoAndGetToken',
      accessTokenPack
    )
    res.json({
      youkuohao_token: youkuohao_token,
      type: 'wechat',
      userinfo: userinfo
    })
  } catch(e){
    next(e)
  }
})