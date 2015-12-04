/**
 * pagenav v0.0.0-SNAPSHOT
 * @param {object} setting
 */

function pagenav(setting){

  var dataLength = setting.dataLength
  var pageNums = setting.pageNums || 10
  var $pagenav = setting.$pagenav || $('.pagination')
  var targetPage = Number(setting.targetPage) || 1

  // Class: disable, hide
  // prev,active,next: 1,2,3

  var page = {
    start: 1,
    prev: targetPage - 1,
    active: targetPage,
    next: targetPage + 1,
    end: Math.ceil( dataLength / pageNums) || 1,
    startClass: '',
    prevClass: '',
    activeClass: 'active',
    nextClass: '',
    endClass: '',
    prevArrowClass: '',
    nextArrowClass: '',
    prevEllipsisClass: '',
    nextEllipsisClass: ''
  }

  // 判断是否隐藏Ellipsis
  if (page.end <= 5) {
    page.prevEllipsisClass = 'hide'
    page.nextEllipsisClass = 'hide'
    page.prevArrowClass = 'hide'
    page.nextArrowClass = 'hide'

  } else {

    if (page.active <= page.start + 2) {
      page.prevEllipsisClass = 'hide'
    }

    if (page.active >= page.end - 2){
      page.nextEllipsisClass = 'hide'
    }

  }

  // 如果当前页是第一页或者最后一页
  // 改变加亮的按钮
  if (page.active == page.start) {
    page.activeClass = 'hide'
    page.startClass = 'active'

    if (page.active == page.end) {
      page.endClass = 'hide'
    }

  } else if (page.active == page.end) {
    page.activeClass = 'hide'
    page.endClass = 'active'
  }

  // 隐藏不显示的
  if (page.prev <= page.start){
    page.prevClass = 'hide'
  }

  if (page.prev < page.start) {
    page.prevArrowClass += ' disabled'
  }

  if (page.next >= page.end){
    page.nextClass = 'hide'
  }

  if (page.next > page.end){
    page.nextArrowClass += ' disabled'
  }

  // 更新dom
  $pagenav.html(JST['pagenav']({page:page}))

}