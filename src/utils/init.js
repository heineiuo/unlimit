import {combineReducers} from 'sprucejs'
import {opendb, promisifydb, subdb} from './db'


export default (db, config) => new Promise(async(resolve, reject) => {
  const basedb = promisifydb(subdb(db, 'base'));

  let isInitInDB = false;
  let initdata = Object.assign({}, config.production.init);

  try {
    // await basedb.del('init');
    const dbdata = await basedb.get('init');
    isInitInDB = true;
    initdata = dbdata;

  } catch(e) {
    if (e.name == 'NotFoundError') isInitInDB = false;
    await basedb.put('init', initdata);
    console.log('[gateway] Running init.');
    await runInit(db, initdata)
  }

  if (isInitInDB) {
    console.log('[gateway] Init data has been found, init in production.json will be ignore.');
  } else {
    console.log('[gateway] Use initdata in production.json')
  }

  resolve()
})

const runInit = (db, initdata) => new Promise(async (resolve, reject) => {
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
});