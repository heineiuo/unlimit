import {Router} from 'express'
import paramRule from '../middleware/param-rule'
import Admin from '../model/Admin'
import User from '../model/User'

const router = module.exports = Router()

router.route('/state').post(async function(req, res, next) {

  try {
    var user = await User.getUser(req.body.youkuohao_token)
    var admin = await Admin.getAdminByUserId(user._id)
    res.json({user: user, admin: admin})
  } catch(e){
    next(e)
  }

})

router.route('/dev/new').post(async function(req, res, next){
  try {
    var admin = await Admin.createOne(req.body)
    res.json({user: user, admin: admin})
  } catch(e){
    next(e)
  }
})

router.route('/login').post(async function (req, res, next) {
  try {
    var user = await User.login(req.body)
    var admin = await Admin.login(user.id)
    res.json({user: user, admin: admin})
  }catch(e){
    next(e)
  }

})