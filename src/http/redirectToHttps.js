import UAParser from 'ua-parser-js'

module.exports = (config) => (req, res, next) => {
  try {
    if ( config.production.https.approvedDomains.indexOf(req.headers.host) == -1 ) return next();
    if ( req.protocol == 'https' ) return next();
    const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser();
    if (config.debug) console.log(browser);
    if (browser.name == 'IE' && Number(browser.major) < 9) return next();
    res.redirect(`https://${req.headers.host}${req.originalUrl}`)
  } catch(e){
    next(e)
  }

};