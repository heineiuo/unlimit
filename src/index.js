
import config from './utils/config'
import {opendb, promisifydb, subdb} from './utils/db'
import init from './utils/init'
import createHub from './integration'
import createServer from './http'

const start = async () => {

  try {
    const db = opendb(`${config.datadir}/db`);
    const hub = createHub(db);

    await init(db, config);

    const server = createServer(config, hub);
    hub.io.attach(server);

    // or only start WebSocket server
    // hub.listen(3443)

  } catch(e){
    console.log(e.stack);
    process.cwd(1);
  }
};

start();