import express from 'express'
import config from '../utils/config'

const middleware = (config, seashell) => {

  if (config.http === true) {
    const app = express();

    app.use(require('morgan')(':req[host]:url :method :status :res[content-length] - :response-time ms', {}));
    app.use(require('compression')());
    app.use((req, res, next) => {
      res.locals.seashell = seashell;
      next()
    });
    app.use(require('./redirectToHttps')(config));
    app.use(require('./globalHeaders')(config));
    app.use(require('./handler')(config));
    app.use(require('./404')(config));

    if (config.start) {
      app.listen(80, () => console.log('Listening on port 80'));
      require('./letsencrypt/force')(app)
    }
  }

  return (req, res, next) => {
    next()
  }

};

export default module.exports = middleware