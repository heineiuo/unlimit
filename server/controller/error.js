var _ = require('lodash')
var conf = require('../conf')


module.exports.err500 = function(err, req, res, next){
  if (!err) return next()
  console.log(err)
  if (typeof err === 'string' && _.has(conf.errorData, err)) {
    return res.json(conf.errorData[err])
  }
  res.sendStatus(500)
}

module.exports.err404 = function(req, res){
  res.sendStatus(404)
}