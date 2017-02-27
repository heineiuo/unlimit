
import config from './utils/config'
import {opendb, promisifydb, subdb} from './utils/db'
import init from './utils/init'
import createHub from './integration'
import createServer from './http'

const start = async () => {

  const db = opendb(`${config.datadir}/db`);
  const hub = createHub(db);

  try {
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
      await init(db, initdata)
    }

    if (isInitInDB) {
      console.log('[gateway] Init data has been found, init in production.json will be ignore.');
    } else {
      console.log('[gateway] Use initdata in production.json')
    }

    const server = createServer(subdb(db, 'gateway'), config, hub);

    hub.io.attach(server);

  } catch(e){
    console.log(e.stack);
    process.cwd(1);
  }
};

start();