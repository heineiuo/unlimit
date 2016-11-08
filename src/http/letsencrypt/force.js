import config from '../../utils/config'
import https from 'https'

module.exports = (app) => {
  var lex = require('letsencrypt-express').create({
    server: config.https.server,
    email: config.https.email,
    agreeTos: true,
    approvedDomains: config.https.approvedDomains,
    app: app,
    renewWithin: (91 * 24 * 60 * 60 * 1000),
    renewBy: (90 * 24 * 60 * 60 * 1000),
    debug: true
  });

  https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
  });

};