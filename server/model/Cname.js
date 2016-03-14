var Datastore = require('nedb')

var Cname = module.exports = new Datastore({
  filename: './data/Cname.db',
  autoload: true
})