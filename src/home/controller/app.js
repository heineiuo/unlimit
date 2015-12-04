var controller = controller || pansy.Controller()

/**渲染我的app列表**/
controller('app.list', function(req, res, next){

  $("#page-container").html(JST['app/list']())

  ajax('app.list').data({
    appId: conf.appId,
    userId: conf.userId
  }).exec(function(err, data){

    if (err) return $("#page-container .app-list").html('获取数据失败')
    $("#page-container .app-list").html(JST['app/list-content'](data))

  })

  res.end()

})


/** 新建app **/
controller('app.new', function(req, res, next){

  $("#page-container").html(JST['app/new']())

  $('.btn-submit').on('click', function(){

    var formdata = {appId: conf.appId}
    var $form = $(this).closest('.form')
    $form.find('[name]').each(function(index, item){
      var $item = $(item)
      formdata[$item.attr('name')] = $item.val()
    })
    ajax('app.new').data(formdata).exec(function(err, data){
      if (err) return $('.form-error').html(err)
      $(".new-inner").html(JST['app/new-success']())
    })

  })

  res.end()

})



controller('app.detail', function(req, res, next){

  $("#page-container").html(JST['app/detail']())

  var formdata = {
    appId: req.params[2],
    userId: conf.userId,
    access_token: conf.access_token
  }
  ajax('app.detail').data(formdata).exec(function(err, data){

    if (err) return $('#page-container').html('获取数据失败')
    $(".detail-inner").html(JST['app/detail-list'](data))

  })


  res.end()

})



controller('app.edit', function(req, res, next){

  $("#page-container").html(JST['app/edit']())

  var formdata = {
    appId: req.params[2],
    userId: conf.userId,
    access_token: conf.access_token
  }

  ajax('app.detail').data(formdata).exec(function(err, data){

    if (err) return $('.edit-inner').html('获取数据失败')

    $(".edit-inner").html(JST['app/edit-form'](data))

  })
  res.end()

})


