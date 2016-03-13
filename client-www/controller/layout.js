var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))
var cookie = require('../lib/cookie')

var layout = module.exports = {}

layout.renderLayout =  function(req, res, next){

  if ($("#page-container").length ==0){
    $("#container").html(JST['layout']())
  }

  if (req.serverStatus.logged)  {
    $('#userbar').html(JST['_userbar']())
    $('#userbar .btn-logout').on('click', function(){
      cookie('cname_token').delete()
      cookie('__session').delete()
      location.href = conf.hrefPrefix + '/login'
    })
    //$(".sidebar").html(JST['_sidebar']({pathname: req.pathname})).removeClass('hide')
  }

  next()

}
