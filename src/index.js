
import config from './utils/config'
import {opendb, promisifydb, subdb} from './utils/db'
import init from './utils/init'
import createHub from './integration'
import createServer from './http'

const start = async () => {

  try {
    const db = opendb(`${config.datadir}/db`);
    const hub = createHub(db);

    if (config.init) await init(hub, config);

    // start with https server or only start WebSocket server
    // also can be used standalone like `hub.io.listen(3443)`
    const server = createServer(config.production.https, hub.integrations.gateway);
    hub.io.attach(server);

  } catch(e){
    console.log(e.stack);
    process.cwd(1);
  }
};

start();