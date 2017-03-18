import config from './utils/config'
import {opendb, promisifydb, subdb} from './utils/db'
import init from './utils/init'

import Seashell, {createServer} from '../../../seashell'
import service from './integration/service'
import account from './integration/account'
import gateway from './integration/gateway'

const start = async () => {

  try {
    const db = opendb(`${config.datadir}/db`);
    const hub = new Seashell();
    hub.integrate(gateway('gateway', subdb(db, 'gateway')));
    hub.integrate(service('service', subdb(db, 'service')));
    hub.integrate(account('account', subdb(db, 'account')));

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