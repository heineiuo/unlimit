var seashell = require('seashell')
var router = module.exports = require('express').Router()
var paramRule = require('../lib/param-rule')

/**
 * param rules list
 */
var needAccessToken = paramRule.Rule('access_token', 'query', 'has')
var needPage = paramRule.Rule('page', 'query', 'has')

/**
 * router list
 */
router.route('/list').get(paramRule.use(
  needAccessToken,
  needPage
), async function (req, res, next) {
  res.json(await seashell.import('fudi-order', {
    actionName: 'orderList',
    page: req.query.page
  }))
})


router.route('/create').get(paramRule.use(
  needAccessToken
), async function (req, res, next) {
  res.json(await seashell.import('fudi-order', {
    actionName: 'createOne'
  }))
})

router.route('/updatePayment').get(function (req, res, next) {
  seashell.import('fudi-order', {
    actionName: 'updatePayment'
  }, res.json)
})


router.route('/test').get(function (req, res, next) {
  seashell.import('fudi-order', {
    actionName: 'createOne',
    userId: "sbsbsdafjhdkashgjkahdfjkhak"
  }, function (response) {
    console.log('get response')
    res.json(response)
  })
})