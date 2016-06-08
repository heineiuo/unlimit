import {Router} from 'express'

const seashell = require('seashell')
const router = module.exports = Router()
const paramRule = require('../lib/param-rule')

import User from '../model/User'
import Admin from '../model/Admin'

/**
 * param rules list
 */
var needAccessToken = paramRule.Rule('access_token', 'query')

/**
 * router list
 */
router.route('/test').get(paramRule.use(
  needAccessToken
), function (req, res, next) {
  seashell.import('fudi-order', {
    actionName: 'createOne',
    userId: "sbsbsdafjhdkashgjkahdfjkhak"
  }, function (response) {
    console.log('get response')
    res.json(response)
  })
})

/**
 * 更新信息
 */
router.route('/profile').post(async function(req, res, next){

  try {

  } catch(e){

  }

})