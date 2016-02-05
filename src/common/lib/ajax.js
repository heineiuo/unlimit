/**
 * ajax
 * created by 庄泽进
 */


var createAjax = module.exports = function(api){

  return function(name, data, callback){

    if (typeof api[name] == 'undefined'){
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
          return this
        },

        exec: function (callback){

          if (typeof api.__autoData === 'function') {
            this.data(api.__autoData())
          }

          console.info("请求数据: 名称",name,'数据', this._data)

          if (!_.has(api, name)){
            return callback(name+'不存在')
          }

          if (api.__development || api[name][0] == 0) {

            if (!_.has(api, '__mock')) {
              return console.log('不支持mock')
            }
            if (!_.has(api.__mock, name)) {
              return console.log('mock数据未定义')
            }
            var data = api.__mock[name](this._data)
            console.info("返回数据(模拟): 名称",name,'数据', data)
            return callback(null, data)
          }

          var url  = api[name][2];
          url += url.match(/\?/)?'&':'?'
          url += '_timestamp=' + new Date().getTime()
          url += '&debug=stack'

          var dataType = api[name][3] || 'json'

          if (this._param != null) {
            url += '/'+this._param
          }

          console.log(this._data)

          $.ajax({
              url: url,
              type: api[name][1],
              data: this._data,
              dataType: dataType
            })
            .done(function(body){
              if (dataType == 'json') {
                if (body.error){
                  console.info('请求真实接口报错')
                  callback(body.error, body)
                } else {
                  console.info('返回真实接口正常: 名称',name,'数据', body)
                  callback(null, body)
                }
              } else {
                // 返回非json数据
                console.info('返回非json数据')
                callback(null, body)
              }
            })
            .fail(function (a, b, c) {
              console.info('接口异常')
              callback('接口异常')
            })

          this._param = null
          this._data = {}


        },

        _data: {},
        _param: null

      }

    }

  }


}

