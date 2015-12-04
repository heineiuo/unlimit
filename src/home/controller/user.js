var controller = controller || pansy.Controller()

controller('user.requireLogin', function(req, res, next){

  if (_.has(conf, 'access_token') ) {
    return next()
  }

  if (_.has(conf, 'checkedLogin')) {
    return res.redirect('/login')
  }

  conf.checkedLogin = true

  if (!cookie('access_token').val()) return res.redirect('/login')

  ajax('profile').data({
    access_token: cookie('access_token').val()
  }).exec(function(err ,data){

    if (err) {
      cookie('access_token').remove()
      return res.redirect('/login')
    }

    conf.userId = data.userId
    conf.access_token = cookie('access_token').val()
    conf.user = req.user = data
    $('#userbar').html(JST['_userbar']({user: conf.user}))
    $(".sidebar").html(JST['_sidebar']({pathname: req.pathname})).removeClass('hide')
    next()

  })

})