import {Router} from 'express'
import Joi from 'joi'
import awaitify from '../util/awaitify'

const router = module.exports = Router()

/**
 * login
 */
router.route('/api/login').post(async (req, res, next) => {

  try {
    await awaitify(Joi.validate)(req.body, Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    }), {allowUnknown: true})

    const {seashell} = res.locals
    const response = await seashell.request('/account/login', {
      username: req.body.username,
      password: req.body.password
    })

    if (response.error) return next(response.error)
    res.json(response)

  } catch(e){
    next(e)
  }
})

/**
 * 获取用户信息
 */


