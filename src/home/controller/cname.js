var controller = controller || pansy.Controller()


controller('cname.list', function(req, res){

  $("#page-container").html(JST['cname/list']())

  var formdata = {
    appId: conf.appId,
    userId: conf.userId,
    access_token: conf.access_token
  }

  ajax('cname.list').data(formdata).exec(function(err, data){
    if (err) return $(".cname-list").html('获取列表失败')

    $(".cname-list").html(JST['cname/list-content'](data))

  })

  res.end()

})

controller('cname.new', function(req, res){

  $("#page-container").html(JST['cname/new']())

  ajax('host.list').exec(function(err, data){

    if (err) return $(".cname-wrap").html('获取域名列表失败')
    $(".cname-wrap").html(JST['cname/new-inner'](data))

    $('.btn-submit').on('click', function(){
      var formdata = {}
      $(this).closest('.form').find('[name]').each(function(index, item){
        formdata[$(item).attr('name')] = $(item).val()
      })
      ajax('cname.new').data(formdata).exec(function(err, data){
        if (err) return $(".form-error").html(err)
        $('.cname-wrap').html(JST['cname/new-success']())
      })
    })

  })


  res.end()

})



controller('cname.detail', function(req, res){
  $("#page-container").html(JST['cname/detail-wrapper']())

  var formdata = {
    userId: conf.userId,
    access_token: conf.access_token,
    id: req.params[2]
  }

  ajax('cname.detail').data(formdata).exec(function(err, data){

    if (err)  return $('#page-container').html('获取详情失败')
    $(".cname-detail-inner").html(JST['cname/detail']({cname: data}))

  })

  res.end()

})



controller('cname.edit', function(req, res){

  $("#page-container").html(JST['cname/edit-wrapper']())

  var formdata = {
    id: req.params[2],
    userId: conf.userId,
    access_token: conf.access_token
  }
  ajax('cname.detail').data(formdata).exec(function(err, data){

    if (err) return $(".cname-inner").html('获取详情失败')
    $(".cname-inner").html(JST['cname/edit-form']({cname: data}))

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
