var mongodb_download = require('mongodb-download')

var install = module.exports.install = function (options, callback) {

}

var start = module.exports.start = function (opt, callback) {

}

var stop = module.exports.stop = function (opt, callback) {

}

var restart = moudle.exports.restart = function (opt, callback) {

  stop(opt, function (err) {
    if (err) return callback(err)
    start(function (err) {
      if (err) return callback(err)
      callback(null)
    })
  })

}