var controller = controller  || purple.Controller()



controller('error.err500', function (err, req, res, next) {
  if (!err) return next()
  console.log({
    error: "EXCEPTION_ERROR",
    stack: err.stack
  })
  res.send(500)
})

controller('error.err404', function (req, res) {
  res.send(403)
})