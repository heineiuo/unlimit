const Datastore = require('nedb-promise')

const Relation = new Datastore({
  filename: `${process.cwd()}/build/data/relation.db`,
  autoload: true
})


export default Relation