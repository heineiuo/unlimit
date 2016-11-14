/**
 * Copyright 2015 - 2016 Youkuohao.
 * @provideModule httpStart
 */
import morgan from 'morgan'
import compression from 'compression'

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
  app.use(require('./404')(config));
  app.listen(80, () => console.log('Listening on port 80'));
  require('./acme/raw')(config, app, () => console.log('Listening on port 443'))
};

export default httpStart