import * as API from '../../sdk/api'

export const getHostList = (page=1)=> {
  return (dispatch, getState) => {


  }
}

//
// var conf = require('../conf')
// var ajax = require('../lib/ajax')(require('../conf/api'))
//
// var host = {}
//
// /**渲染我的app列表**/
// host.list = function(req, res){
//   $("#page-container").html(JST['host/list']())
//
//   ajax('host.list').exec(function(err, data){
//     if (err) return $("#page-container .host-list").html('获取数据失败')
//     $("#page-container .host-list").html(JST['host/list-content'](data))
//   })
//
//   res.end()
//
// }
//
//
// /** 添加host  **/
// host.new = function(req, res){
//
//   $("#page-container").html(JST['host/new']())
//
//   //ajax('app.list').exec(function(err, data){
//     //if (err) return $(".host-new-wrap").html(JST['host/new-load-app-fail']())
//     //if (data.applist.length==0) return $(".host-new-wrap").html(JST['host/no-app']())
//   //}
//
//   $(".host-new-wrap").html(JST['host/new-form']())
//
//   $(".btn-submit").on('click', function(){
//     var formdata = {}
//     $(this).closest('.form').find('[name]').each(function(index, item){
//       formdata[$(item).attr('name')] = $(item).val()
//     })
//     ajax('host.new').data(formdata).exec(function(err, result){
//       if (err) return $('.form-error').html(err)
//       $("#page-container").html(JST['host/new-success']({host: result}))
//     })
//
//   })
//
//
//   res.end()
//
// }
//
//
// host.detail = function(req, res){
//
//   ajax('hostDetail').data({hostId: req.params[1]}).exec(function(err, result){
//     if (err) return $('#page-container').html(err)
//     $("#page-container").html(JST['host/detail'](result))
//
//     $("#deleteHost").on('click', function(){
//       if (window.confirm('确认删除?')){
//         ajax('hostDelete').data({hostId: req.params[1]}).exec(function(err, result){
//           if (err) return alert(err)
//           location.href = conf.hrefPrefix + '/'
//         })
//       }
//     })
//
//     $("[data-updatesort]").on('click', function () {
//       var sort = Number($(this).attr('data-sort'))
//       var targetSort = $(this).attr('data-updatesort')=='up'?sort-1:sort+1
//       if (targetSort<1) return false
//       var $tr = $(this).closest('tr')
//       ajax('locationUpdateSort').data({
//         targetSort: targetSort,
//         hostId: $tr.attr('data-hostId'),
//         locationId: $tr.attr('data-locationId')
//       }).exec(function (err, result) {
//         if (err) alert(err)
//         location.reload()
//       })
//     })
//
//   })
//
//   res.end()
//
// }