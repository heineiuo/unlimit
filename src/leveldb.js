import level from 'levelup'
import levelSubLevel from 'level-sublevel'
import ql from 'q-level'
import getConfig from './config'

let leveldb = null;
let isSetup = false;

const makeSubLevels = (db, list) => {
  const collections = {
    sub: (subname) => {
      const lowerName = subname.toLowerCase();
      if (collections.hasOwnProperty(lowerName)) return collections[lowerName];
      return ql(db.sublevel(lowerName))
    }
  };
  list.forEach(name => {
    const lowerName = name.toLowerCase();
    if (['collection', 'sub'].indexOf(lowerName) > -1) {
      throw new Error('sublevel name could not be {sub, collection}');
    }
    collections[name] = collections[lowerName] = collections.sub(name)
  });

  collections.collection = collections.sub;

  return collections;
};


const setup = () => new Promise(async (resolve, reject) => {
  try {
    const {datadir} = await getConfig();
    const db = levelSubLevel(level(`${datadir}/db`), {
      keyEncoding: 'utf8',
      valueEncoding:'json'
    });
    leveldb = makeSubLevels(db, []);
    isSetup = true;
    resolve(leveldb)
  } catch(e){
    reject(e)
  }
})

const getLeveldb = (options={customError: 'LEVEL_DB_CANNOT_ACCESS'}) => new Promise(async (resolve, reject) => {
  if (isSetup) return resolve(leveldb);
  try {
    resolve(await setup())
  } catch(e){
    console.error(e)
    reject(options.customError)
  }
})

export default getLeveldb