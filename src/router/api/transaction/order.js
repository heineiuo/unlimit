import {Router} from 'express'

var router = module.exports = Router()

/**
 * router list
 */
router.route('/list').get(async  (req, res, next) => {
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


router.route('/create').get(async  (req, res, next) => {
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

router.route('/updatePayment').get(async (req, res, next) => {
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


router.route('/test').get(async (req, res, next) => {
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