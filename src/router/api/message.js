var seashell = require('seashell')
var router = module.exports = require('express').Router()
var paramRule = require('../lib/param-rule')

/**
 * param rules list
 */
var needAccessToken = paramRule.Rule('access_token', 'query')

/**
 * router list
 */
router.route('/').get(paramRule.use(needAccessToken))
router.route('/').get(function (req, res, next) {
  seashell.import('fudi-order', {
    actionName: 'orderList',
    page: 1
  }, function (response) {
    console.log('get response')
    res.json(response)
  })
})

router.route('/').post(paramRule.use(
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