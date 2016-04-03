var _ = require('lodash')
var conf = require('../conf')


module.exports.err500 = function(err, req, res, next){
  if (!err) return next()
  console.log(err)
  if (typeof err === 'string') {
    if (_.has(conf.errorData, err)){
      return res.json(conf.errorData[err])
    }
    return res.json({error: err})
  }
  res.json({error: 'EXCEPTION_ERROR'})
}

module.exports.err404 = function(req, res){
  res.sendStatus(404)
}