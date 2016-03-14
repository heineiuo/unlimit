var Datastore = require('nedb')

var Config = module.exports = new Datastore({
  filename: './data/Config.db',
  autoload: true
})