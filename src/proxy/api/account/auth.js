import {Router} from 'express'
import Joi from 'joi'

const router = module.exports = Router()

/**
 * automatic get code
 *
 * app_id must in `trust list`
 */
router.route('/get-code-automatic').get(async(req, res, next)=>{

})


/**
 * @api
 * @request req.query.user_token
 */
router.route('/get-code-by-user-action').get(async(req, res, next)=>{

})

router.route('/get-access-token-by-code').get(async (req, res, next)=>{

})