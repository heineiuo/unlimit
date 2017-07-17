import level from 'levelup'
import levelSubLevel from 'level-sublevel'
import ql from 'q-level'
import Graph from './Graph'
import Collection from './Collection'

let db = null

class Db {
  constructor(options) {
    if (db) return db
      
     const _db = levelSubLevel(level(options.dbpath), {
      keyEncoding: options.keyEncoding,
      valueEncoding: options.valueEncoding
    });

    db = {
      _collections: {},
      collection: (subname) => {
        const lowerName = subname.toLowerCase();
        if (!!db._collections[lowerName]) return db._collections[lowerName];
        db._collections[lowerName] = new Collection(ql(_db.sublevel(lowerName)))
        return db._collections[lowerName]
      },

      graph: (db, options) => {
        return new Graph(db, options)
      },

      getCollectionNames: () => {
        return Object.keys(db._collections)
      }
    };

    if (options.presets) {
      options.presets.forEach(name => {
        const lowerName = name.toLowerCase();
        if (['get', 'set'].indexOf(lowerName) > -1) {
          throw new Error('sublevel name could not be {get, set}');
        }
        db.collection(name)
      });
    }

    return db;
  }
}

export default Db
