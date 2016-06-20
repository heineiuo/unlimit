import express from 'express'

const router = module.exports = express.Router()


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

