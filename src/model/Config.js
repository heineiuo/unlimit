var Datastore = require('nedb-promise')

var Config = module.exports = new Datastore({
  filename: './data/Config.db',
  autoload: true
})