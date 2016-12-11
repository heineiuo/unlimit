import Hub from './hub'
import httpStart from './http'
import http from 'http'
import express from 'express'
import config from './utils/config'

import gateway from './integration/gateway'
import service from './integration/service'
import account from './integration/account'

const start = async () => {

  try {
    const app = express();
    const server = http.createServer(app);
    const hub = new Hub(server);

    hub.integrate({name: 'gateway', router: gateway});
    hub.integrate({name: 'service', router: service});
    hub.integrate({name: 'account', router: account});

    app.use((req, res, next) => {
      res.hub = hub;
      next()
    });

    return httpStart(config, app);

  } catch(e){
    console.log(e.stack||e);
    process.cwd(1);
  }
};

start();