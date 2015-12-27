var controller = controller || pansy.Controller()

controller('renderInstall', function(req, res, next){

  if (req.serverStatus.isInstalled) {
    return res.redirect('/')
  }

  $("#page-container").html(JST['install/index']())

  $(".btn-submit").on('click', function(){
    var $form = $($(this).attr('data-form'))
    if (!$form.length) {
      $form = $(this).closest('.form')
    }
    var formdata = {}
    $form.find('[name]').each(function(index, element){
      formdata[$(element).attr('name')] = $(element).val()
    })
    ajax('install').data(formdata).exec(function(err, result){
      if (err) return $form.html('接口错误:'+err)
      location.href = conf.hrefPrefix+'/'
    })

  })

  res.end()
})


controller('requireInstalled', function(req, res, next){
  if (req.serverStatus.isInstalled) return next()
  res.redirect('/install')
})