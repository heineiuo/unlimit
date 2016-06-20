import express from 'express'

const router = module.exports = express.Router()



/**********
 *
 * 接收消息模块
 *
 *********/

// 消息验证
router.route('/').get(async function (req, res, next) {
  try {
    const sdk = res.locals.wechatsdk
    const checkResult = await sdk.core.receiveCheck(req.query)
    res.send(checkResult)
  } catch(e){
    next(e)
  }

})

// 接收消息
router.route('/').post(async function (req, res, next) {
  try {
    const sdk = res.locals.wechatsdk
    const parsed = await sdk.core.receiveMsg(req.body)
    // todo 处理自动回复和转发到客服
    res.send('success')
  } catch(e){
    next(e)
  }

})
