import * as API from '../../sdk/api'

/**
 * 渲染我的app列表
 */
export const getHostList = (page=1)=> {
  return async (dispatch, getState) => {
    try {
      const data = await API.getHostList()
      const list = data.list
      dispatch({
        type: "HOST_LIST_UPDATE",
        hostList: list
      })
    } catch(e){
      alert(e)
    }
  }
}




/**
 * 添加host
 */
export const createHost = ()=> {
  return async (dispatch, getState) => {
    try {
      const data = await API.createHost()
      dispatch({
        type: "HOST_CREATE_ONE",
        hostList: list
      })
    } catch(e){
      alert(e)
    }

  }
}


/**
 * 获取location列表
 * @returns {function()}
 */
export const getHostLocationList = (host_id)=>{
  return async (dispatch, getState)=>{
    try {
      const data = await API.getLocationList(host_id)
      if (data.error) throw data.error
      dispatch({
        type: "UPDATE_LOCATION_LIST",
        currentHost: data.host,
        currentHostId: host_id,
        locationList: data.list
      })
    } catch(e) {
      console.log(e)
      alert(e)
    }
  }
}

/**
 * 排序,设置优先级
 * @returns {function()}
 */
export const editLocationSort = ()=>{

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



