/**
 * Copyright heineiuo
 * @provideModule proxy
 */
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import {seashellProxyMiddleware} from 'seashell-proxy';

const app = express();
const server = http.createServer(app);

app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(bodyParser.json({type: 'text/html'}));
app.use(bodyParser.json({type: 'text/plain'}));
app.use(seashellProxyMiddleware(require('../src')));
app.use((req, res) => res.end('NOT FOUND \n GATEWAY.'));

server.listen(
  8080,
  () => console.log(`HTTP start listening on port ${8080}`)
);
