import {Router} from 'express'
import paramRule from '../middleware/param-rule'
import Admin from '../model/Admin'
import User from '../model/User'
import Banner from '../model/Banner'

const router = module.exports = Router()

// 设置banner
router.route('/').post(async function(req, res, next){

  try {
    await Admin.getAdminByToken(req.body.youkuohao_token)
    const banner = await Banner.createOne(req.body)
    res.json({banner})
  } catch(e) {next(e)}

})

router.route('/update').post(async function(req, res, next){
  try {
    await Admin.getAdminByToken(req.body.youkuohao_token)
    const banner = await Banner.updateOne(req.body)

    res.json({banner})

  } catch(e){
    next(e)
  }
})

router.route('/list').get(async function(req, res, next){

  try {
    if (typeof req.query.admin_mode != 'undefined'){
      await Admin.getAdminByToken(req.query.youkuohao_token)
    }
    const list = await Banner.list(req.query)
    res.json({ list })

  } catch(e){next(e)}

})