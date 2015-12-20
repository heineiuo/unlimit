
controller.error500 = function(err, req, res, next){
  if (!err) return next()
  console.log({
    error: "EXCEPTION_ERROR",
    stack: err.stack
  })
  res.sendStatus(500)
}

controller.error404 = function (req, res) {
  res.sendStatus(403)
}