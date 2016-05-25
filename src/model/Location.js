var Datastore = require('nedb-promise')

var Location = module.exports = new Datastore({
  filename: './data/Location.db',
  autoload: true
})