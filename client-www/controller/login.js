var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))
var cookie = require('../lib/cookie')

var login = module.exports = {}

login.renderLogin = function(req, res, next){

  $("#page-container").html(JST['auth']())

  $(".btn-submit").on('click', function(){
    var formData = {}
    var $form = $(this).closest('.form')
    $form.find('[name]').each(function(index, element){
      formData[$(element).attr('name')] = $(element).val()
    })
    ajax('login').data(formData).exec(function(err, result){
      if (err) return $form.html(err)
      cookie('__session').remove()
      cookie('access_token').val(result.access_token)
      location.href = conf.hrefPrefix + '/'
    })
  })



}