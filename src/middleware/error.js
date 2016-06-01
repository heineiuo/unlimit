var _ = require('lodash')

module.exports.err500 = function(err, req, res, next){
  if (!res.headersSent) {
    if (!err) return next()
    console.log(err)
    if (typeof err === 'string') {
      return res.json({error: err})
    }
    res.json({error: 'EXCEPTION_ERROR'})
  }
}

module.exports.err404 = function(req, res){

  res.end('NOT FOUND')
}