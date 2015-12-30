var controller = controller || pansy.Controller()


controller('home',  function(req, res) {


  $("#page-container").html(JST['host/list']())

  ajax('host.list').exec(function(err, data){
    if (err) return $("#page-container .host-list").html('获取数据失败')
    $("#page-container .host-list").html(JST['host/list-content'](data))
  })


  res.end()
})


