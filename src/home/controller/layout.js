var controller = controller || pansy.Controller()

controller('layout', function(req, res, next){

  if ($("#page-container").length ==0){
    $("#container").html(JST['layout']())
  }

  if (req.serverStatus.logged)  {
    $('#userbar').html(JST['_userbar']())
    $('#userbar .btn-logout').on('click', function(){
      cookie('password').delete()
      location.href = conf.hrefPrefix + '/login'
    })
    //$(".sidebar").html(JST['_sidebar']({pathname: req.pathname})).removeClass('hide')
  }

  next()

})
