/**
 * datepicker v0.0.1
 * @licence MIT LICENCE
 * @author heineiuo http://www.heineiuo.com
 * @copyright www.heineiuo.com
 * 2015-01-23 20:41:08
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {


  /**
   * 输出对象。这里是个函数，直接用于生成dataPicker实例
   */
  function create(args) {



    function setTime (time) {
      /**
       * 可接受参数位时间戳或时间对象
       */
      if (typeof time == 'number') {
        var time = new Date(time)
      } else if ( !time instanceof Date) {
        return "ILLEAGL_VALUE" // 传入参数错误
      }

      /**
       * 如果在预设的时间范围之外，则报错
       */
      if (dateRange[0] - time >0 || dateRange[1] - time <0) {
        return "ILLEAGL_TIME_VALUE"
      }

      var year  = time.getYear()+1900
      var month = time.getMonth()+1
      var date  = time.getDate()

      $datePicker.find('select.year').val(year)
      $datePicker.find('select.month').val(month)
      $datePicker.find('select.date').val(date)

      return false
    }



    /**
     * 获取当前所选择年月日的时间戳
     */
    function getTimestamp () {
      return getTimeDate().getTime()
    }

    function getTimeDate () {

      /**
       * 拼接出日期格式
       */
      var date = $datePicker.find('select.year').val()+'/'
        +$datePicker.find('select.month').val()+'/'
        +$datePicker.find('select.date').val()

      return new Date(date)

    }

    /**
     * 当更改月份的时候，检查日期列表是否符合当月的总日数，依据情况作出修改
     */
    function check () {
      var nowDateSum = $datePicker.find('select.date option').length
      var trueDateSum = getDateSum($datePicker.find('select.year').val(),
        $datePicker.find('select.month').val())

      if (nowDateSum > trueDateSum) {

        if ($datePicker.find('select.date').val()>trueDateSum) {
          $datePicker.find('select.date').val(1)
        }

        for (var i = nowDateSum-1; i > trueDateSum-1; i--) {
          $datePicker.find('select.date option').eq(i).remove()
        }



      } else if (nowDateSum < trueDateSum) {

        for (var i = nowDateSum+1; i < trueDateSum+1; i++) {
          $datePicker.find('select.date').append('<option value="'+i+'">'+i+'</option>')
        }
      }
    }

    /**
     * 判断是否是闰年
     */
    function isLeapYear (year) {
      return year%400 == 0 || ( year%4 == 0 && year%100 != 0 )?true:false;
    }

    /**
     * 根据当前的年、月获取 "这个月有多少天"
     */
    function getDateSum (year, month) {
      var s = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (month != 2) {
        return s[month-1]
      } else {
        return isLeapYear(year)?29:28 // 闰年+1
      }
    }

    /**
     * 点击选择切换日期的Event Handle
     */
    function clickDate (event) {
      var $this = $(this)

      if (typeof args.callback === 'function') {
        args.callback({
          timestamp: getTimestamp()
        })
      };
    }

    /**
     * 点击空白处隐藏弹出列表的 Event Handle
     */
    function clickWhite (event) {
      var $this = $(this)
      if ($this.closest('.clickable').length==0) {
        $datePicker.find('.select').removeClass('open')
      }
    }

    function changeSelect (event) {
      check()
    }

    /**
     * 获取DOM
     */
    var $datePicker = $(args.selector)

    if ($datePicker.length && !$datePicker.hasClass('done')) {

      var newDate   = new Date()
      var initDate  = args.initDate || newDate
      var dateRange = args.dateRange || [new Date('1900/01/01'), newDate]

      $datePicker.append('<select class="year"></select>'
        +'<select class="month"></select>'
        +'<select class="date"></select>')

      /**
       * 生成年
       */
      var $yearOptions = $('<select></select>')
      for (var i = dateRange[0].getYear()+1900; i < dateRange[1].getYear()+1901; i++) {
        $yearOptions.prepend('<option value="'+i+'">'+i+'</option>')
      }
      $datePicker.find('select.year').html($yearOptions.children())
        .val(initDate.getYear()+1900)

      /**
       * 生成月
       */
      var $monthOptions = $('<select></select>')
      for (var i = 1; i < 13; i++) {
        $monthOptions.append('<option value="'+i+'">'+i+'</option>')
      };
      $datePicker.find('select.month').html($monthOptions.children())
        .val(initDate.getMonth()+1)
      /**
       * 生成日
       */
      var $dateOptions = $('<select></select>')
      for (var i = 1; i < getDateSum(initDate.getYear()+1900, initDate.getMonth()+1)+1; i++) {
        $dateOptions.append('<option value="'+i+'">'+i+'</option>')
      };
      $datePicker.find('select.date').html($dateOptions.children())
        .val(initDate.getDate())

      /**
       * 绑定监听事件
       * 由于控件改用传统的 select>option 模式，舍弃了clickDate和clickWhite
       */
      if (args.listen) {
        $datePicker.on('change', 'select.month, select.year', changeSelect)
        // $datePicker.on('click', '.datepicker-clickable', clickDate)
        // $datePicker.on('click', clickWhite)
      };


      $datePicker.addClass('done')

      var datePicker = {
        getTimeDate : getTimeDate,
        getTimestamp: getTimestamp,
        check       : check,
        setTime     : setTime
      }

      return datePicker
    }

  }



  return create

}));