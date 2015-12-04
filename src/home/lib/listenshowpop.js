/**
 * 首页 仿天猫菜单
 * @param $navitem
 * @param $menuitem
 */
function listenShowPop($navitem, $menuitem){

  var showing = null;
  var hiding = null;
  var t

  /**
   * 显示三级菜单
   */
  $navitem.on('mouseenter', function () {
    readyshow($(this).index());
  }).on('mouseleave', function () {
    lazyhide($(this).index())
  });

  $menuitem.on('mouseenter', function () {
    readyshow($(this).index());
  }).on('mouseleave', function () {
    lazyhide($(this).index());
  });

  function readyshow(index) {
    $menuitem.eq(index).addClass('hover')
    setTimeout(function(){
      show(index)
    }, 1)
  }

  function show(index) {
    clearTimeout(t)
    if (showing != index) {
      hide(showing);
      showing = index;
      $navitem.eq(index).addClass('selected')
      $menuitem.eq(index).addClass('active')
    }
  }

  function lazyhide(index) {
    $menuitem.eq(index).removeClass('hover')
    hiding = index;
    t = setTimeout(function(){
      hide(index)
    }, 300)
  }

  function hide(index){
    showing = null;
    hiding = null;
    $menuitem.eq(index).addClass('removing').removeClass('active')
    setTimeout(function(){
      $menuitem.eq(index).removeClass('removing')
    }, 150);
    $navitem.eq(index).removeClass('selected')
  }
} // end listenshowpop


