/**
 * Create by Hansel on 2015-6-29 15:24:58
 */

/**
 * validator
 * @param key
 * @param val
 * @param callback
 */

var regs = {
  camera_ip: [{
    regex: /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
    msg: '请输入正确的IP地址，范围0~255'
  },{
    regex: function(val){
      return val != '0.0.0.0'
    },
    msg: '请输入正确的IP地址'
  }],

  camera_presetNum: {
    regex: /^[1-9]\d*$/,
    msg: '请输入正整数'
  },

  mic_id: {
    regex: /^[1-9]\d*$/,
    msg: '请输入正整数'
  },

  crestron_port: {
    regex: /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/,
    msg: '请输入1~65535之间的整数'
  },

  camera_name: {
    regex: function(val){
      return $.trim(val).length != 0
    },
    msg: '摄像头名称不能为空'
  },

  mic_name: {
    regex: function(val){
      return $.trim(val).length != 0
    },
    msg: '麦克风名称不能为空'
  }
}

function validator(key, val, callback){

  var regexs = []
  var err = null

  if (regs[key] instanceof Array) {
    regexs = regs[key]
  } else {
    regexs.push(regs[key])
  }


  for (var i=0;i<regexs.length;i++){
    var regex = regexs[i].regex
    var msg = regexs[i].msg
    if (typeof regex == 'function') {
      if (!regex(val)){
        err = msg
        break
      }
    } else if (!regex.test(val)) {
      err = msg
      break
    }
  }

  callback(err)

}
