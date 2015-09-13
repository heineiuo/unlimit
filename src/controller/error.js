

var error = module.exports = {}

error.err500 = function (err, req, res, next) {
  if (!err) {
    return next()
  }
  return res.json({
    error: "ERR_UNEXCEPTION",
    stack: err.stack
  })
}


error.err404 = function (req, res) {
  //res.status(404).json({
  res.json({
    error: 'ERR_NOT_FOUND',
    url: req.originalUrl
  })
}