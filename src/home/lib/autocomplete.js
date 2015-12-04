/**
 *
 * @param {object} conf
 */
function autocomplete(conf){

  var $input = $(conf.input);
  var $form = $input.closest('form').eq(0);
  var $result = $(conf.menu);
  var $ul = $result.children('ul');
  var $window = $(window);
  var resultLimit = 10; // todo
  var cacheVal = '';
  var focusing = false;
  var queryResult = conf.queryResult;
  var tHide;


  $input.attr("autocomplete", "off");

  $input.on('focus', function(ev) {

    focusing = true;

    if ($input.val() == '') {
      hideResult();
    } else {
      assemUl();
      showResult();
    }

  });

  $input.on('blur', function(ev){

    focusing = false;

    $input.val(cacheVal);
    hideResult();
  });


  /**
   * 主要是监听input内容的变化
   */
  $window.on('keyup', function(ev){
    var keyCode = ev.keyCode;
    if (keyCode == 13||keyCode ==38 ||keyCode==40||keyCode==27) {

    } else {
      updateCacheVal();
    }

    function updateCacheVal(){
      if (cacheVal !== $input.val()){
        cacheVal = $input.val();
      }
      if (cacheVal==''){
        hideResult()
      }
      assemUl();
    }

  });


  /**
   * 主要是上下选择和回车提交的监听
   * esc后隐藏掉面板，所以上线选择的时候，判断是否为空，不为空就显示，
   * 回车的时候提交表单
   */
  $window.on('keydown', function(ev){

    if (!focusing){
      return
    }

    var keyCode = ev.keyCode;

    if (keyCode == 13) {
      enter()
    } else if (keyCode == 38) {
      select(-1)
    } else if (keyCode == 40) {
      select(1)
    } else if (keyCode == 27) {
      esc()
    } else {
      assemUl();
    }


    function select(direction){

      if (cacheVal == '') {
        return
      }

      var $items = $ul.children('.item');
      var $targetLi;
      var $activeLi = $items.siblings('.active');
      if($activeLi.length == 0){
        $targetLi = $items.eq(0)
      } else {
        var targetEq = $activeLi.index()+direction
        if(targetEq > $items.length - 1){
          targetEq = 0
        } else if ( targetEq < 0) {
          targetEq = $items.length - 1
        }

        $targetLi = $items.eq(targetEq);
        $activeLi.removeClass('active')
      }
      $targetLi.addClass('active');
      $input.val($targetLi.attr('data-val'));

      showResult();

    }

    function enter(){

      if ($input.val() == '') {
        ev.preventDefault();
        return false
      }
      $form.submit()

    }

    function esc(){
      $input.val(cacheVal);
      hideResult();
    }


  });


  $result.on('mouseenter', '.item', function(ev){
    $ul.children('.active').removeClass('active');
    $(ev.target).closest('.item').addClass('active');
  });

  $result.on('click', '.item', function(ev){

    var $item = $(ev.target).closest('.item');
    var val = $item.attr('data-val');
    $input.val(val);
    $form.submit();

  });

  function showResult(){
    clearTimeout(tHide);
    $result.show();
  }

  function hideResult(){
    cacheVal = $input.val();
    tHide = setTimeout(function(){
      $result.hide()
    },10)
  }

  /**
   * 显示列表
   */
  function assemUl(){

    if (cacheVal != '') {

      queryResult(cacheVal, function(data){

        var htmlAs = [];
        var htmlBs = [];
        var htmlC;

        // => ['about', 'after', 'and', 'also']
        var templateA = _.template('<li class="item" data-val="{{vars.src}}">' +
          '<span>{{vars.category}} - “{{vars.src}}”</span>' +
          '<em>约{{vars.number}}个结果</em>' +
          '</li>', {variable: "vars"});

        var templateB = _.template('<li class="item bg-gray" data-val="{{vars.value}}">' +
          '<span>{{vars.value}}</span>' +
          '<em>约{{vars.number}}个结果</em>' +
          '</li>', {variable: "vars"});

        var templateC = _.template('<li class="item bg-gray" data-val="{{vars.src}}">' +
          '<span>找 “{{vars.src}}” 相关店铺</span>' +
          '</li>', {variable: "vars"});


        _.map(data, function(value){
          if (value.type == 'category'){
            value.src = cacheVal;
            htmlAs.push(templateA(value));
          } else {
            htmlBs.push(templateB(value));
          }
        });

        htmlC = templateC({src: cacheVal});

        $ul.html(htmlAs.join('')+htmlBs.join('')+htmlC);

        $result.show();

      });
    }

  }

}