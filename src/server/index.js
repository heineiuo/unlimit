import express from 'express'
import http from 'http'
import createServer from 'auto-sni'

import config from './utils/config'
import ServiceServer from './ServiceServer'
import createApp from './http'
import gateway from './integration/gateway'
import service from './integration/service'
import account from './integration/account'

const start = async () => {

  try {
    const app = express();
    const server = http.createServer(app);
    const hub = new ServiceServer(server);

    hub.integrate({name: 'gateway', router: gateway});
    hub.integrate({name: 'service', router: service});
    hub.integrate({name: 'account', router: account});

    app.use((req, res, next) => {
      res.gateway = hub.integrations.gateway;
      next()
    });

    app.use(createApp(config));

    createServer({
      email: config.https.email,
      agreeTos: true,
      debug: config.https.debug,
      domains: config.https.domains,
      forceSSL: false,
      redirectCode: 301,
      ports: {
        http: 80,
        https: 443
      }
    }, app).once("listening", () => console.log("listening"));


  } catch(e){
    console.log(e.stack||e);
    process.cwd(1);
  }
};

start();