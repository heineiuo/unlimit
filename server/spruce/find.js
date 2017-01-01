/**
 * Copyright 2016 heineiuo <heineiuo@gmail.com>.
 */

module.exports = (db) => (query={}) => new Promise(async (resolve, reject) => {
  try {
    const option = {
      keys: true,
      values: true,
      revers: false,
      limit: 100,
      fillCache: true
    };

    if (query.prefix) {
      option.start = query.prefix;
      option.end = query.prefix.substring(0, query.prefix.length - 1)
        + String.fromCharCode(query.prefix[query.prefix.length - 1].charCodeAt() + 1)
    }

    if (query.limit) {
      option.limit = query.limit
    }

    const result = [];
    db.createReadStream(option).on('data',  (data) => {
      result.push(Object.assign({_key: data.key}, data.value));
    }).on('error', (err) => {
      reject(err)
    }).on('close', () => {

    }).on('end',  () => {
      resolve(result)
    })

  } catch(e) {
    reject(e)
  }
});

