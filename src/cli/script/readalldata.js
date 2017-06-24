const level = require('levelup');
const qLevel = require('q-level');
const levelSubLevel = require('level-sublevel');
const os = require('os');
const path = require('path');
const argv = require('yargs').argv;

const opendb = (dbdir) => {
  return level(dbdir, {valueEncoding:'json'})
};

const promisifydb = (db) => {
  return qLevel(db)
};

const subdb = (db, subname) => {
  return levelSubLevel(db).sublevel(subname)
};


const start = async () => {
  const db = level(path.join(os.homedir(), argv.dbpath));

  db.createReadStream()
    .on('data', function (data) {
      console.log(data.key, '=', data.value)
    })
    .on('error', function (err) {
      console.log('Oh my!', err)
    })
    .on('close', function () {
      console.log('Stream closed')
    })
    .on('end', function () {
      console.log('Stream ended')

      db.close()
    })
};


start();