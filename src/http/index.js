import express from 'express'

const createApp = (config) => {

  if (config.http === true) {
    const app = express();

    app.use(require('morgan')(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
    app.use(require('compression')());
    app.use((req, res, next) => {
      res.removeHeader("x-powered-by");
      // res.locals.seashell = seashell;
      next()
    });
    app.use(require('./redirectToHttps')(config));
    app.use(require('./handler')(config));
    app.use(require('./404')(config));

    return app
  }
};

const httpStart = (config, app) => {
  app.listen(80, () => console.log('Listening on port 80'));
  require('./acme/raw')(config, app)
};

export default createApp
export {httpStart}