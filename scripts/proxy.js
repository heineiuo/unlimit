/**
 * Copyright heineiuo
 * @provideModule proxy
 */
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import Hub from '../src/hub'
import gateway from '../src/integration/gateway'
import service from '../src/integration/service'
import account from '../src/integration/account'
import config from '../src/utils/config'


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

app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json({type: 'text/html'}));
app.use(bodyParser.json({type: 'text/plain'}));
app.use(async (req, res, next) => {

  try {
    const {hub} = res;
    const {gateway} = hub.integrations;

    const data = Object.assign({}, req.query, req.body, {
    });

    const requestPath = req.path;
    // console.log(requestPath);
    const seashellResult = await gateway.request(requestPath, data);
    res.json(seashellResult.body)
  } catch(e){
    if (config.debug) console.log(e.stack||e);
    next(e)
  }

});
app.use((req, res) => res.end('NOT FOUND \n GATEWAY.'));

server.listen(
  8080,
  () => console.log(`HTTP start listening on port ${8080}`)
);
