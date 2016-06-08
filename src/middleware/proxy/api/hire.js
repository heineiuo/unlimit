import {Router} from 'express'
import paramRule from '../middleware/param-rule'
import Admin from '../model/Admin'
import User from '../model/User'
import Hire from '../model/Hire'
import HireLog from '../model/HireLog'
import _ from 'lodash'

const router = module.exports = Router()

// 管理员
router.route('/').post(async function(req, res, next){
  try {
    const admin = await Admin.getAdminByToken(req.body.youkuohao_token)
    req.body.user_id = admin.user_id

    console.log(req.body)
    const hire = await Hire.createOne(req.body)
    res.json({hire: hire})
  }catch(e){
    next(e)
  }
})


router.route('/list').get(async function(req, res, next){
  try {
    const list = await Hire.list(req.query)
    res.json({list: list})
  } catch(e){
    next(e)
  }
})

router.route('/detail/:hireId').get(async function(req, res, next){
  try {
    const hireId = req.params.hireId
    const hire = await Hire.getHireById(hireId)
    hire.regiseterd = false
    if (req.query.youkuohao_token) {
      const user = await User.getUser(req.query.youkuohao_token)
      hire.regiseterd = await HireLog.checkHasLog(user._id, hire._id)
    }
    res.json({detail: hire})
  } catch(e){
    next(e)
  }
})


router.route('/total').get(async function(req, res, next){
  try {

    const total = await Hire.count({isDeleted: {$ne: true}})
    res.json({
      total: total
    })

  }catch(e){
    next(e)
  }
})

// 需要登录
router.route('/reg').post(async function(req, res, next){
  try {
    const user = await User.getUser(req.body.youkuohao_token)
    req.body.user_id = user._id
    const hireLog = await HireLog.createOne(req.body)
    res.json({hireLog: hireLog})
  } catch(e){
    next(e)
  }
})

router.route('/reg/list').get(async function(req, res, next){
  try {
    const list = await HireLog.list(req.query)
    res.json({list: list})
  } catch(e){
    next(e)
  }
})

/**
 * 报名表总数
 */
router.route('/reg/total').get(async function(req, res, next){
  try {

    const total = await HireLog.count({isDeleted: {$ne: true}})
    res.json({
      total: total
    })
  }catch(e){
    next(e)
  }
})
