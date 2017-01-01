/**
 * Copyright 2015 - 2016 heineiuo <heineiuo@gmail.com>
 * @provideModule httpStart
 */
import morgan from 'morgan'
import compression from 'compression'
import createServer from 'auto-sni'

const httpStart = (config, app) => {
  app.use(morgan(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
  app.use(compression());
  app.use((req, res, next) => {
    res.removeHeader("x-powered-by");
    // res.locals.seashell = seashell;
    next()
  });
  app.use(require('./redirectToHttps')(config));
  app.use(require('./handler')(config));

  app.use((req, res) => {
    res.status(404);
    res.end('NOT FOUND \n SEASHELL SERVER.')
  });

  const server = createServer({
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
  }, app);

  server.once("listening", () => {
    console.log("listening");
  });

  // app.listen(80, () => console.log('Listening on port 80'));
  // require('./acme/raw')(config, app, () => console.log('Listening on port 443'))
};

export default httpStart