var _ = require('lodash')
var ent = require('ent')

/**
 * 登录
 */
const login = function(req, res, next) {

  const {conf} = res.locals
  if (!_.has(req.body, 'password')) return next('PERMISSION_DENIED')
  if (req.body.password != conf.password) return next('PERMISSION_DENIED')

  var result = _.omit(conf, 'password')
  res.json(result)

}

export default login