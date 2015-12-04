/**
 * ajax for red eye rabbit
 * @param name
 * @return enhanced ajax obj
 */
function ajax(name, data, callback){

  if (typeof apiurl[name] == 'undefined'){
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
        //if (_.has(conf, 'access_token')){
        //  this._data.access_token = conf.access_token
        //}
        this._data = _.extend(this._data, data)
        return this
      },

      exec: function (callback){

        if (conf.development || apiurl[name][0] == 0) {

          if (!_.has(mData, name)){
            return callback(name+'不存在')
          }
          var data = mData[name](this._data)
          callback(null, data)

        } else {

          var url  = apiurl[name][2];
          url += url.match(/\?/)?'&':'?'
          url += '_t=' + Date.now()

          var dataType = apiurl[name][3] || 'json'

          if (this._param != null) {
            url += '/'+this._param
          }

          $.ajax({
            url: url,
            type: apiurl[name][1],
            data: this._data,
            dataType: dataType
          })
          .done(function(body){
            if (dataType != 'json') {
              callback(null, body)
            } else if (_.has(body, 'error')) {
              callback(body.error, body)
            } else {
              callback(null, body)
            }
          })
          .fail(function(){callback('服务器异常')})

          this._param = null
          this._error = null
          this._data = {
            access_token: conf.access_token||undefined
          }

        }
      },

      _data: {
        access_token: conf.access_token || undefined
      },
      _param: null,
      _error: null

    }

  }

}