import {combineReducers} from 'sprucejs'
import {opendb, promisifydb, subdb} from './db'

export default (db, initdata) => new Promise(async (resolve, reject) => {
  try {

    const {domain} = initdata;

    const handler = combineReducers([
      require('../integration/gateway/Host'),
      require('../integration/gateway/File'),
      require('../integration/gateway/Location')
    ])(subdb(db, 'gateway'));

    try {
      await handler({
        reducerName: 'host',
        action: 'Delete',
        hostname: domain
      });
    } catch(e){
      console.log(e.stack)
    }


    await handler({
      reducerName: 'host',
      action: 'New',
      hostname: domain
    });


    await handler({
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/account.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'account'
    });

    await handler({
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/gateway.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'gateway'
    });

    await handler({
      reducerName: 'location',
      action: 'New',
      hostname: domain,
      pathname:'/^\/api\/service.*$/',
      cors: true,
      sort: 1,
      type: 'SEASHELL',
      contentType: 'TEXT',
      content: 'service'
    });

    resolve()
  } catch(e){
    reject(e)
  }
})