import level from 'levelup'
import levelSubLevel from 'level-sublevel'
import ql from 'q-level'

import Collection from './Collection'

let collections = null

class Db {
  constructor(options) {
    if (collections) return collections
      
     const db = levelSubLevel(level(options.dbpath), {
      keyEncoding: options.keyEncoding,
      valueEncoding: options.valueEncoding
    });

    collections = {
      sub: (subname) => {
        const lowerName = subname.toLowerCase();
        if (collections.hasOwnProperty(lowerName)) return collections[lowerName];
        return new Collection(ql(db.sublevel(lowerName)))
      }
    };

    options.presets.forEach(name => {
      const lowerName = name.toLowerCase();
      if (['collection', 'sub'].indexOf(lowerName) > -1) {
        throw new Error('sublevel name could not be {sub, collection}');
      }
      collections[name] = collections[lowerName] = collections.sub(name)
    });

    collections.collection = collections.sub;

    return collections;
  }
}

export default Db
