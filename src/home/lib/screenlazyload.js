function screenlazyload(arg){

  /**
   * 记录已经渲染完成的section
   * @type {{}}
   */
  var renderComplete = {}

  /**
   * 计算触发渲染的范围
   * @type {{}}
   */
  var sectionShowRange = {}

  _.map(arg.sections, function(val, key){
    renderComplete[key] = false
    sectionShowRange[key] = {}
    sectionShowRange[key].top = val.el.offset().top
    sectionShowRange[key].bottom = sectionShowRange[key].top + val.el.height()
  })


  /**
   * 滚动监听
   */
  arg.screen.on('scroll mousewheel', findWhoToRender)

  /**
   * 初始化
   */
  findWhoToRender();

  function findWhoToRender() {

    var st = $(window).scrollTop();
    var h = $(window).height();

    _.map(sectionShowRange, function(val, key){
      if( val.top < st+h && val.bottom > st){
        renderSection(key)
      }
    });

    function renderSection(sname){

      if (!renderComplete[sname]){
        arg.sections[sname].fn();
        renderComplete[sname] = true;
        //console.log(sname+'渲染完成')
      }

      /**
       * 检查是否全部渲染完成，如果是，则解除滚动监听
       * @type {boolean}
       */
      var isAllComplete = true;
      _.map(renderComplete, function(val, key){
        if (val == false){
          isAllComplete = false
        }
      });
      if (isAllComplete){
        arg.screen.off('scroll mousewheel', findWhoToRender);
        //console.log('全部section渲染完成')
      }
    }
  }



}