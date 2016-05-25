var Datastore = require('nedb')

var Location = module.exports = new Datastore({
  filename: './data/Location.db',
  autoload: true
})