import express from 'express'

const router = module.exports = express.Router()


/**************
 *
 * 菜单模块 {host}/api/wechat/menu
 *
 ************/

/**
 * 获取菜单
 */
router.route('/get').get(async function(req, res, next){

  try {
    const {seashell, host} = res.locals
    var menuData = await seashell.request('/wechat-mp/menu/get', {
      hostId: host._id
    })
    res.json(menuData)
  } catch(e){
    next(e)
  }

})

/**
 * 创建菜单
 */
router.route('/create').post(async function(req, res, next){
  try {
    const {seashell, host} = res.locals
    var menuData = await seashell.request('/wechat-mp/menu/create', {

    })
    res.json(menuData)
  } catch(e){
    next(e)
  }
})