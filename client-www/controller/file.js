var file = module.exports = {}
var lazyload = require('../lib/lazyload')
var api = require('../conf/api')
var cookie = require('../lib/cookie')
var ajax = require('../lib/ajax')(api)
var encodeQuery = require('../lib/encodeQuery')

file.renderMedia = function (req, res, next) {

  var path = req.query.path || '/'
  path = decodeURI(path)
  $("#page-container").html(JST['file/index']({path: path}))

  ajax('readdir').data({path: path}).exec(function (err, result) {
    if (err) return next(err)
    result.parentPath = path + ( path =='/'?'':'/')
    $("#files-container").html(JST['file/list'](result))

    $("[data-onclick='delete']").on('click', function () {
      if(window.confirm('确定删除该文件吗')){
        ajax('deleteFile').data({
          path: $(this).attr('data-path')
        }).exec(function (err, result) {
          if (err) return next(err)
          location.reload()
        })
      }
    })

    $("[data-onclick='rename']").on('click', function () {
      ajax('renameFile').data({
        path: $(this).prop('data-path')
      }).exec(function (err, result) {
        if (err) return next(err)
        location.reload()
      })
    })

    $("[data-onclick='download']").on('click', function () {
      var path = $(this).attr('data-path')
      var url = api.downloadFile[2]+'?'+encodeQuery({
          path: path,
          location_token: cookie('location_token').val()
        })

      window.open(url)

    })

  })

  lazyload.js([
    'https://blueimp.github.io/jQuery-File-Upload/js/vendor/jquery.ui.widget.js',
    '//cdn.youkuohao.com/libs/jquery.fileupload/5.38.0/jquery.fileupload.js'
  ], function (err, result) {
    if (err) next(err)

    var formData = {
      uploadDir: path,
      location_token: cookie('location_token').val()
    }
    $('#imageupload').fileupload({
      formData: formData,
      url: api['uploadImage'][2]+'?'+encodeQuery(formData),
      dataType: 'json',
      done: function (e, response) {
        var result = response.result
        if (result.error) return alert(result.error)
        $("#imageupload").val(result.url)
        location.reload()
      },

      progressall: function (e, response) {
        //var progress = parseInt(response.loaded / response.total * 100, 10)
        //$('.upload-progress .progress-bar').css(
        //  'width',
        //  progress + '%'
        //)
      }
    })
      .prop('disabled', !$.support.fileInput)
      //.parent().addClass($.support.fileInput ? undefined : 'disabled');

  })

  res.end()

}