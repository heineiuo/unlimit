var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))

var location = module.exports = {}


location.new = function(req, res){

  ajax('hostDetail').data({hostId: req.params[1]}).exec(function(err, result) {
    if (err) return $('#page-container').html(err)
    $("#page-container").html(JST['location/new'](result))


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
      ajax('location.new').data(formData).exec(function(err, data){
        if (err) return $(".form-error").html(err)
        $('#page-container').html(JST['location/new-success']({location: data}))
      })
    })


  })

  res.end()

}



location.edit = function(req, res){

  var hostId = req.params[1]
  var locationId = req.params[3]

  ajax('location.detail').data({
    hostId: hostId,
    locationId: locationId
  }).exec(function(err, data){

    if (err) return $("#page-container").html('获取详情失败')
    $("#page-container").html(JST['location/detail'](data))

    $("#btnDeletelocation").on('click', function () {

      if (window.confirm('确认删除?')){
        ajax('location.delete').data({locationId: locationId}).exec(function (err, result) {
          if (err) return alert('删除失败, 错误代码: '+err)
          res.redirect('/host/'+hostId)
        })
      }

    })

    $(".btn-location-update").on('click', function(event){
      var $locationEdit = $(event.target).closest('.form')
      var formdata = {}
      $locationEdit.find('.active [name]').each(function(index, item){
        var $item = $(item)
        if ($item.attr('type') == 'checkbox'){
          formdata[$item.attr('name')] = $item.prop('checked')
        } else {
          formdata[$item.attr('name')] = $item.val()
        }
      })

      ajax('location.edit').data(formdata).exec(function(err, data){
        if (err) return $('.form-error').html(err)
        res.redirect('/host/'+hostId+'/location/'+locationId)
      })
    })

  })

  res.end()

}
