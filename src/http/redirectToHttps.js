import config from '../utils/config'
import UAParser from 'ua-parser-js'

const redirectToHttps = (conf) => (req, res, next) => {
  // if (conf.https.length == 0) {
  //   if ( req.protocol == 'https' ) {
  //     return res.redirect(`http://${req.headers.host}${req.originalUrl}`)
  //   }
  //   return next()
  // }
  if ( conf.https.approveDomains.indexOf(req.headers.host) == -1 ) return next()
  if ( req.protocol == 'https' ) return next()
  const browser = new UAParser().setUA(req.headers['user-agent']).getBrowser();
  if (config.debug) console.log(browser)
  if (browser.name == 'IE' && Number(browser.major) < 9) return next();
  res.redirect(`https://${req.headers.host}${req.originalUrl}`)
};

module.exports = redirectToHttps;