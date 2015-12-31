var controller = controller || pansy.Controller()

//
//controller('cname.list', function(req, res){
//
//  $("#page-container").html(JST['host/location/list']())
//
//  var formdata = {
//    appId: conf.appId,
//    userId: conf.userId,
//    access_token: conf.access_token
//  }
//
//  ajax('cname.list').data(formdata).exec(function(err, data){
//    if (err) return $(".cname-list").html('获取列表失败')
//
//    $(".cname-list").html(JST['host/location/list-content'](data))
//
//  })
//
//  res.end()
//
//})

controller('cname.new', function(req, res){

  ajax('hostDetail').data({hostId: req.params[1]}).exec(function(err, result) {
    if (err) return $('#page-container').html(err)
    $("#page-container").html(JST['host/location/new'](result))


    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
      $(e.target).find('input').prop('checked', true)
    }).on('hide.bs.tab', function(e){
      $(e.target).find('input').prop('checked', false)
    })


    $('.btn-submit').on('click', function(){
      var formData = {}
      formData.hostId = req.params[1]
      formData.pathname = $('#pathnameInput').val()
      $('.tab-pane.active').find('[name]').each(function(index, item){
        formData[$(item).attr('name')] = $(item).val()
      })
      ajax('cname.new').data(formData).exec(function(err, data){
        if (err) return $(".form-error").html(err)
        $('.cname-wrap').html(JST['host/location/new-success']())
      })
    })


  })

  res.end()

})



controller('cname.detail', function(req, res){

  ajax('cname.detail').data({
    hostId: req.params[1],
    cnameId: req.params[3]
  }).exec(function(err, data){
    if (err) return $('#page-container').html('获取详情失败')
    $("#page-container").html(JST['host/location/detail']({cname: data}))

  })

  res.end()

})



controller('cname.edit', function(req, res){


  ajax('cname.detail').data({
    hostId: req.params[1],
    cnameId: req.params[3]
  }).exec(function(err, data){

    if (err) return $("#page-container").html('获取详情失败')
    $("#page-container").html(JST['host/location/edit'](data))

    $(".btn-cname-edit-save").on('click', function(event){
      var $cnameEdit = $(event.target).closest('.form')
      var formdata = {}
      $cnameEdit.find('[name]').each(function(index, item){
        var $item = $(item)
        formdata[$item.attr('name')] = $item.val()
      })

      ajax('cname.edit').data(formdata).exec(function(err, data){
        if (err) return $('.form-error').html(err)
        app.go(conf.hrefPrefix+'/cname')
      })
    })


  })

  res.end()

})
