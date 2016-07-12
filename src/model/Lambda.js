const Datastore = require('nedb-promise')

const schema = {}



const Lambda = module.exports = new Datastore({
  filename: `${process.cwd()}/data/Lambda.db`,
  autoload: true
})