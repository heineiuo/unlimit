/**
 * User
 */

function user(){

  return {

    __checked: false,
    __logged: false,
    __user: {},

    read: function(){
      return this.__user
    },

    checkLogin: function(callback){

      var that = this

      if (that.__logged) {
        return callback(null, that.__user)
      }

      ajax('check_login').exec(function(err, data){

        if (err) {
          return callback('未登录')
        }

        that.__user = data['data']
        callback(null, that.__user)

      })

    },


    login: function(formdata, callback){

      var that = this
      var ajaxData = formdata

      that.__user = {}
      ajaxData.nchash = ENV.nchash
      ajaxData.formhash = ENV.formhash

      ajax('login').data(ajaxData).exec(function(err, data){

        if (err){
          callback(err)
        } else {
          that.__user.userinfo = data
          callback(null, that.__user)
        }
      })

    },

    logout: function(callback){
      cookie('PHPSESSID').delete()

      if(typeof callback === 'function') {
        callback(null)
      }

      location.reload()
    }

  }

}