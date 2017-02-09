const Datastore = require('nedb-promise')

const Term = new Datastore({
  filename: `${process.cwd()}/build/data/term.db`,
  autoload: true
})


export default Term