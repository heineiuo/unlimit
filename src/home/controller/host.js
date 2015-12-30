var controller = controller || pansy.Controller()

/**渲染我的app列表**/
controller('host.list', function(req, res){
  $("#page-container").html(JST['host/list']())

  ajax('host.list').exec(function(err, data){
    if (err) return $("#page-container .host-list").html('获取数据失败')
    $("#page-container .host-list").html(JST['host/list-content'](data))
  })

  res.end()

})


/** 添加host  **/
controller('host.new', function(req, res){

  $("#page-container").html(JST['host/new']())

  //ajax('app.list').exec(function(err, data){
    //if (err) return $(".host-new-wrap").html(JST['host/new-load-app-fail']())
    //if (data.applist.length==0) return $(".host-new-wrap").html(JST['host/no-app']())
  //}

  $(".host-new-wrap").html(JST['host/new-form']())

  $(".btn-submit").on('click', function(){
    var formdata = {}
    $(this).closest('.form').find('[name]').each(function(index, item){
      formdata[$(item).attr('name')] = $(item).val()
    })
    ajax('host.new').data(formdata).exec(function(err, data){
      if (err) return $('.form-error').html(err)
      $(".host-new-wrap").html(JST['host/new-success']())
    })

  })


  res.end()

})




controller('host.edit', function(req, res){


  res.end()

})

controller('host.detail', function(req, res){

  ajax('hostDetail').data({hostId: req.pathname[1]}).exec(function(err, result){
    if (err) return $('#page-container').html(err)
    $("#page-container").html(JST['host/detail']({host: result}))

    var formdata = {
      appId: conf.appId,
      userId: conf.userId,
      access_token: conf.access_token
    }

    ajax('cname.list').data(formdata).exec(function(err, data){
      if (err) return $(".cname-list").html('获取列表失败')

      $(".cname-list").html(JST['cname/list-content'](data))

    })

  })

  res.end()

})
