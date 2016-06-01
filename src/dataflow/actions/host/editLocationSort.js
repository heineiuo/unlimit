import * as API from '../../../sdk/api'

/**
 * 排序,设置优先级
 * @returns {function()}
 */
const editLocationSort = ()=>{

  // $("[data-updatesort]").on('click', function () {
  //   var sort = Number($(this).attr('data-sort'))
  //   var targetSort = $(this).attr('data-updatesort')=='up'?sort-1:sort+1
  //   if (targetSort<1) return false
  //   var $tr = $(this).closest('tr')
  //   ajax('locationUpdateSort').data({
  //     targetSort: targetSort,
  //     hostId: $tr.attr('data-hostId'),
  //     locationId: $tr.attr('data-locationId')
  //   }).exec(function (err, result) {
  //     if (err) alert(err)
  //     location.reload()
  //   })
  // })

  return async(dispatch, getState)=>{
    try {


    } catch(e){
      alert(e)
    }
  }
}


export default editLocationSort 