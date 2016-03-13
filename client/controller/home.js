var conf = require('../conf')
var ajax = require('../lib/ajax')(require('../conf/api'))

var home = module.exports = {}


home.renderHome = function(req, res) {
  $("#page-container").html(JST['home/index']())


  res.end()
}

