import {Router} from 'express'

const router = module.exports = Router()


/**
 * router list
 */
router.route('/test').get(async (req, res, next)=>{
  try {
    res.json({
      originUrl: req.originalUrl
    })
  } catch(e){
    next(e)
  }
})

/**
 * 更新信息
 */
router.route('/profile').post(async function(req, res, next){

  try {
    res.json({
      originUrl: req.originalUrl
    })
  } catch(e){
    next(e)
  }

})