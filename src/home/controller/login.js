var controller = controller || pansy.Controller()

controller('renderLogin', function(req, res, next){

  $("#page-container").html(JST['auth']())

  $(".btn-submit").on('click', function(){
    var formData = {}
    var $form = $(this).closest('.form')
    $form.find('[name]').each(function(index, element){
      formData[$(element).attr('name')] = $(element).val()
    })
    cookie('password').val(formData.password)
    ajax('login').exec(function(err, result){
      if (err) return $form.html(err)
      location.href = conf.hrefPrefix + '/'
    })
  })


  //
  //if (!_.has(req.query, 'authorization_code')) {
  //  $("#page-container").html(JST['auth']())
  //  return res.end()
  //}
  //
  //ajax('accessToken').data({
  //  authorization_code: req.query.authorization_code
  //}).exec(function(err, data){
  //  if (err) return next(err)
  //  cookie('access_token').val(data.access_token, 30)
  //  res.redirect('/')
  //})

})