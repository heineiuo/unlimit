import express from 'express'

const router = module.exports = express.Router()

/***************
 *
 * 素材模块
 *
 **************/

// 获取永久素材列表
router.route('/material/list').get(async function(req, res, next){
  try {
    const sdk = res.locals.wechatsdk
    const list = await sdk.media.getMaterialList(req.query)
    res.json(list)
  } catch(e){
    next(e)
  }
})
