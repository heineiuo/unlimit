import {Router} from 'express'

const router = module.exports = Router()

router.route('/login').post(async (req, res, next)=>{
  try {
    const {seashell} = this.locals
    res.json({
      originUrl: req.originUrl
    })
  } catch(e){
    next(e)
  }
})