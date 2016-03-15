var mongodb_prebuilt = require('mongodb-prebuilt')

var conf = {
  version: "3.2.1",
  args: {
    fork: true,
    logpath: process.cwd()+'/mongod.log',
    dbpath: process.cwd()+'/data',
    port: '27017'
  }
}

mongodb_prebuilt.start_server(conf, function(err) {
  if (err) return console.log('mongod didnt start:', err)
  console.log('mongod is started')
  process.exit()
})