var seashell = require('seashell')
var router = module.exports = require('express').Router()
var paramRule = require('../lib/param-rule')

var needAccessToken = paramRule.Rule('access_token', 'query')

/**
 * router list
 */
router.route('/list').get(paramRule.use(
  needAccessToken
), function (req, res, next) {
  seashell.import('fudi-product', {
    actionName: 'productList',
    page: 1
  }, function (response) {
    console.log('get response')
    res.json(response)
  })
})


router.route('/').post(paramRule.use(
  needAccessToken
), async function (req, res, next) {

  try {
    var userId = await seashell.import('fudi-account', {
      access_token: req.body.access_token
    })
    var responseData = await seashell.import('fudi-product', {
      actionName: 'createOne',
      userId: userId
    })

    res.json(responseData)

  } catch(e) {
    res.json({error: "EXCEPTION_ERROR", errorStack: e})
  }

})