var controller = controller || pansy.Controller()

controller('user.requireLogin', function(req, res, next){

  if (!cookie('password').val()) return res.redirect('/login')
  if (req.serverStatus.logged) return next()
  res.redirect('/login')

})