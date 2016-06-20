import Router from 'express'

const router = module.exports = Router()

/***********
 *
 * 客服模块
 *
 **********/

// 发送消息
router.route('/sendMsg').get(async function(req, res, next){
  try {
    res.json({})
  } catch(e){
    next(e)
  }
})