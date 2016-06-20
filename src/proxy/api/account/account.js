import {Router} from 'express'
import Joi from 'joi'
import awaitify from '../../../util/awaitify'

const router = module.exports = Router()

/**
 * originUrl: /api/account/login
 */
router.route('/login').post(async (req, res, next)=>{
  try {
    await awaitify(Joi.validate)(req.body, Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }), {allowUnknown: true})

    const {seashell, host} = res.locals
    const {username, password} = req.body
    const result = await seashell.request('/account/login', {
      host_id: host._id,
      username: username,
      password: password
    })
    if (result.error) return next(result.error)
    res.json(result)
  } catch(e){
    console.log(e.stack||e)
    next(e)
  }
})

/**
 * 注册
 */
router.route('/register').post(async (req, res, next) => {
  try {

    await awaitify(Joi.validate)(req.body, Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    }), {allowUnknown: true})

    const {seashell, host} = res.locals
    const {username, password} = req.body
    const result = await seashell.request('/account/register', {
      host_id: host._id,
      username: username,
      password: password
    })

    if (result.error) return next(result.error)
    res.json(result)

  } catch(e){
    next(e)
  }
})

/**
 * 发送验证码
 */
router.route('/send-reset-password-code').post(async (req, res, next) => {
  try {

  } catch(e){
    next(e)
  }
})

/**
 * 通过验证码修改密码
 */
router.route('/reset-password').post(async (req, res, next)=>{
  try {

  } catch(e){
    next(e)
  }
})
