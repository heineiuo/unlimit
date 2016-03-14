var Datastore = require('nedb')

var Host = module.exports = new Datastore({
  filename: './data/Host.db',
  autoload: true
})