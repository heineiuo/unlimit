/**
 * Copyright 2016 heineiuo <heineiuo@gmail.com>
 */

import qLevel from 'q-level';
import levelSubLevel from 'level-sublevel';
import db from './db';

const {sublevel} = levelSubLevel(db);

class Model {
  constructor (modelName, schema) {
    const sub = sublevel(modelName);
    const dbPromise = qLevel(sub);
    dbPromise.find = require('./find')(sub);

    class Child {
      constructor (data) {
        const that = this;
        Object.keys(data).forEach(key => {
          if (schema.hasOwnProperty(key)){
            that[key] = data[key]
          }
        })
      };

      static statics = {};
      static modelName = modelName;
      static get = dbPromise.get;
      static put = dbPromise.put;
      static del = dbPromise.del;
      static find = dbPromise.find;
      static createReadStream = sub.createReadStream;

      save () {
        const that = this;
        return new Promise(async (resolve, reject) => {
          resolve(that)
        })
      }
    }

    return Child
  }

}

export default Model
