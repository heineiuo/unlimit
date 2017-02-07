import express from 'express'
import http from 'http'
import createServer from 'auto-sni'
import Seashell from 'seashell'

import config from './utils/config'
import createApp from './http'
import gateway from './integration/gateway'
import service from './integration/service'
import account from './integration/account'
import {opendb, promisifydb, subdb} from './utils/db'
import init from './utils/init'


const start = async () => {

  try {
    const db = opendb(`${config.datadir}/db`);
    const basedb = promisifydb(subdb(db, 'base'));

    await basedb.del('init');

    let isInitInDB = false;
    let initdata = Object.assign({}, config.production.init);

    try {
      const dbdata = await basedb.get('init');
      isInitInDB = true;
      initdata = dbdata

    } catch(e){
      if (e.name == 'NotFoundError') isInitInDB = false;
      await basedb.put('init', initdata);
      console.log('[gateway] running init.');
      await init(db, initdata)
    }

    if (isInitInDB) {
      console.log('[gateway] initdata has been found, init in production.json will be ignore.');
    } else {
      console.log('[gateway] use initdata in production.json')
    }

    const app = express();
    const server = http.createServer(app);
    const hub = new Seashell(db, server);

    console.log(hub.Socket);

    hub.integrate({name: 'gateway', router: gateway(db)});
    hub.integrate({name: 'service', router: service(db, hub.handler)});
    hub.integrate({name: 'account', router: account(db)});

    app.use((req, res, next) => {
      res.gateway = hub.integrations.gateway;
      next()
    });

    app.use(createApp(db, config));

    createServer({
      email: config.production.https.email,
      agreeTos: true,
      debug: config.production.https.debug,
      domains: config.production.https.domains,
      forceSSL: false,
      redirectCode: 301,
      ports: {
        http: 80,
        https: 443
      }
    }, app).once("listening", () => console.log("listening"));


  } catch(e){
    console.log(e.stack);
    process.cwd(1);
  }
};

start();