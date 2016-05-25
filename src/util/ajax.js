/**
 * ajax
 * created by 庄泽进
 */


var createAjax = module.exports = function(api){

  return function(name, data, callback){

    if (typeof api[name] == 'undefined'){
      return console.warn('ajax方法未找到: '+name)
    }

    //api[name] = [
    // 0: Number, 是否调用真实接口
    // 1: String, 'POST', 'GET'等
    // 2: String, url,接口地址
    // 3: String, dataType, 'json', 'jsonp'
    // ]

    if (arguments.length == 1){
      return assemAjax(name)
    } else {
      assemAjax(name).data(data).exec(callback)
    }

    function assemAjax(name){

      return {
        _url: api[name][2],
        _data: {},
        _param: null,

        param: function(param){
          this._url += '/'
          this._url += param
          return this
        },

        query: function (json) {
          this._url += this._url.indexOf('?')>0?'&':'?'
          this._url += encodeQuery(json)
          return this
        },

        data: function(data){
          this._data = _.extend(this._data, data)
          return this
        },

        exec: function (callback){

          if (!_.has(api, name)){
            return callback(name+'不存在')
          }

          if (typeof api.__autoData === 'function') {
            if (api[name][1]=='GET') {
              this.query(api.__autoData())
            } else {
              this.data(api.__autoData())
            }
          }

          this.query({'_timestamp=': new Date().getTime()})

          console.info("请求数据: 名称",name,'数据', this._data)

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


          var dataType = api[name][3] || 'json'

          var options = {
            url: this._url,
            type: api[name][1],
            data: this._data,
            dataType: dataType
          }

          if (dataType=='jsonp') options.jsonp = 'callback'

          $.ajax(options)
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


        }
      }

    }

  }


}

function encodeQuery(data) {
  var ret = [];
  for (var d in data)
    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
  return ret.join("&");
}

