

// 向服务器验证登录状态
function login(formdata, callback) {

  __user = {}

  ajax('login').data(formdata).exec(function(err, data){

    if (data.error){
      callback(data.error)
    } else {
      __user.userinfo = data
      createCookie('username', formdata.username)
      createCookie('password', formdata.password)
      callback(null, __user.userinfo)
    }
  })

}


// 检查是否是登录状态
function checkLogin(callback){

  if (__user.userinfo) {
    return callback(null, __user.userinfo)
  }

  var cookieData = {
    username: readCookie('username'),
    password: readCookie('password')
  }

  if (cookieData.username && cookieData.password) {
    login(cookieData, function(err, userinfo){
      if (err) {
        deleteCookie('username')
        deleteCookie('password')
        return callback('未登录')
      }

      callback(null, userinfo)

    })
  } else {
    callback('未登录')
  }

}

// 注销登录状态
function logout(callback){
  deleteCookie('username')
  deleteCookie('password')

  if(typeof callback === 'function') {
    callback(null)
  }

  location.reload()
}


// 登录弹窗

function loginModal(){

  var $modalLogin = $('#modal-login')
  if(!$modalLogin.length) {
    $('body').append(JST['user/login/modal'])
    $modalLogin = $('#modal-login')

  }

  $modalLogin.modal('show')

  $modalLogin.find('.btn-save').on('click', function(){

    var formdata = {
      username: $('#username').val(),
      password: $('#password').val()
    }

    //todo validator

    login(formdata, function(err, userinfo){
      if (err) {
        return alert(err)
      }

      location.reload()

    })

  })

}

