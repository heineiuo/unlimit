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

const renameSub = (dbpath, oldSubName, newSubName) => new Promise(async (resolve, reject) => {
  try {
    const db = level(path.join(os.homedir(), dbpath));
    const oldSub = promisifydb(subdb(db, oldSubName));
    const newSub = promisifydb(subdb(db, newSubName));

    const result = []

    oldSub.createReadStream()
      .on('data', function (data) {
        result.push(data)
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        db.close();
        process.exit()
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', async function () {
        console.log('Stream ended')
        await writeData()
        await removeOldData()
        db.close();
        console.log('[renameSub] Success')
        process.exit(1)
      })

    const writeData = () => new Promise(async (resolve, reject) => {
      try {
        await Promise.all(result.map(item => {
          return newSub.put(item.key, item.value)
        }))
        resolve()
      } catch(e){
        reject(e)
      }

    })

    const removeOldData = () => new Promise(async (resolve, reject) => {
      try {
        await Promise.all(result.map(item => {
          return oldSub.del(item.key)
        }))
        resolve()
      } catch(e){
        reject(e)
      }

    })

  } catch(e){
    reject(e)
  }

});


const start = async () => {
  try {
    console.log(argv)
    await renameSub(argv.dbpath, argv.oldSubName, argv.newSubName)
  } catch(e){
    console.log(e.stack)
  }
}

start()