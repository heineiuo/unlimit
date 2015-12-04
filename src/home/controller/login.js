var controller = controller || pansy.Controller()

controller('login', function(req, res, next){

  if (!_.has(req.query, 'authorization_code')) {
    $("#page-container").html(JST['auth']())
    return res.end()
  }

  ajax('accessToken').data({
    authorization_code: req.query.authorization_code
  }).exec(function(err, data){
    if (err) return next(err)
    cookie('access_token').val(data.access_token, 30)
    res.redirect('/')
  })

})