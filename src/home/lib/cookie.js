/**
 * cookie 操作
 */

function cookie(name){

  var __cookie = {
    name: name
  }

  __cookie.val = function(value, days){
    if (typeof value == 'undefined') {
      var nameEQ = __cookie.name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;

    }

    if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
    }
    else var expires = ""; // session
    document.cookie = __cookie.name+"="+value+expires+"; path=/";

  }

  __cookie.delete = __cookie.remove = function(){
    this.val('', -1)
  }

  return __cookie


}