var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))

var cname = module.exports = {}


cname.new = function(req, res){

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
      ajax('cname.new').data(formData).exec(function(err, data){
        if (err) return $(".form-error").html(err)
        $('#page-container').html(JST['location/new-success']({cname: data}))
      })
    })


  })

  res.end()

}



cname.edit = function(req, res){

  var hostId = req.params[1]
  var cnameId = req.params[3]

  ajax('cname.detail').data({
    hostId: hostId,
    cnameId: cnameId
  }).exec(function(err, data){

    if (err) return $("#page-container").html('获取详情失败')
    $("#page-container").html(JST['location/detail'](data))

    $("#btnDeleteCname").on('click', function () {

      if (window.confirm('确认删除?')){
        ajax('cname.delete').data({cnameId: cnameId}).exec(function (err, result) {
          if (err) return alert('删除失败, 错误代码: '+err)
          res.redirect('/host/'+hostId)
        })
      }

    })

    $(".btn-cname-update").on('click', function(event){
      var $cnameEdit = $(event.target).closest('.form')
      var formdata = {}
      $cnameEdit.find('.active [name]').each(function(index, item){
        var $item = $(item)
        formdata[$item.attr('name')] = $item.val()
      })

      ajax('cname.edit').data(formdata).exec(function(err, data){
        if (err) return $('.form-error').html(err)
        res.redirect('/host/'+hostId+'/cname/'+cnameId)
      })
    })


  })

  res.end()

}
