var controller = controller || pansy.Controller()

controller('layout', function(req, res, next){

  if ($("#page-container").length ==0){
    $("#view-scope").html(JST['layout']())
  }

  if (_.has(conf, 'access_token') ) {

    $('#userbar').html(JST['_userbar']({user: conf.user}))
    $(".sidebar").html(JST['_sidebar']({pathname: req.pathname})).removeClass('hide')
    return next()
  }

  next()


})