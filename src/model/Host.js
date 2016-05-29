const Datastore = require('nedb')

const Host = module.exports = new Datastore({
  filename: `${process.cwd()}/data/Host.db`,
  autoload: true
})