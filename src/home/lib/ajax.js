/**
 * ajax
 * created by 庄泽进
 */
var mData = {}
function ajax(name, data, callback){

  if (typeof mData[name] == 'undefined'){
    return console.warn('ajax方法未找到: '+name)
  }


  if (arguments.length == 1){
    return assemAjax(name)
  } else {
    assemAjax(name).data(data).exec(callback)
  }

  function assemAjax(name){

    return {
      param: function(param){
        this._param = param;
        return this
      },

      data: function(data){
        this._data = _.extend(this._data, data)
        //this._data.form_submit = 'ok'
        return this
      },

      exec: function (callback){

        console.info("请求数据: 名称",name,'数据', this._data)

        if (conf.development || mData[name][0] == 0) {

          if (!_.has(mData, name)){
            return callback(name+'不存在')
          }
          if (!_.has(mData[name], 'mock')) {
            return console.log(name, 'mock数据未定义')
          }
          var data = mData[name].mock(this._data)
          console.info("返回数据(模拟): 名称",name,'数据', data)
          callback(null, data)

        } else {

          var url  = mData[name][2];
          url += url.match(/\?/)?'&':'?'
          url += '_rnd=' + Date.now()

          var dataType = mData[name][3] || 'json'

          if (this._param != null) {
            url += '/'+this._param
          }

          console.log(this._data)

          $.ajax({
            url: url,
            type: mData[name][1],
            data: this._data,
            dataType: dataType
          })
          .done(function(body){
            if (dataType == 'json' && typeof body.state != 'undefined') {
              if (typeof body.error == 'undefined'){
                callback(null, body)
              } else {
                console.info('返回数据(真实): 名称',name,'数据', body)
                callback(body.error, body)
              }
            } else {
              // 返回非json数据
              callback(null, body)
            }
          })
          .fail(function (a, b, c) {
            callback('接口异常')
          })

          this._param = null
          this._data = {}

        }

      },

      _data: {},
      _param: null

    }

  }

}


