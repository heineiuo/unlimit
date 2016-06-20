import {Router} from 'express'

const router = module.exports = Router()

/**
 * router list
 */
router.route('/list').get(async (req, res, next) => {
  try {
    const {seashell} = res.locals
    const response = await seashell.request('fudi-order/orderList', {
      page: 1
    })
    res.json(response)
  } catch(e){
    next(e)
  }
})