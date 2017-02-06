/**
 * Copyright 2015 - 2016 heineiuo <heineiuo@gmail.com>
 * @provideModule httpStart
 */
import morgan from 'morgan'
import compression from 'compression'
import express from 'express'

const createApp = (db, config) => {
  const app = express();

  app.use(morgan(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
  app.use(compression());
  app.use((req, res, next) => {
    res.removeHeader("x-powered-by");
    // res.locals.seashell = seashell;
    next()
  });
  app.use(require('./redirectToHttps')(config));
  app.use(require('./handler')(db, config));

  app.use((err, req, res, next) => {
    console.log(err);
    res.json({error: err.msg})
  });

  app.use((req, res) => {
    res.status(404);
    res.end('NOT FOUND \n SEASHELL SERVER.')
  });

  return app;

  // app.listen(80, () => console.log('Listening on port 80'));
  // require('./acme/raw')(config, app, () => console.log('Listening on port 443'))
};

export default createApp