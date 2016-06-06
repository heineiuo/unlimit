import fs from 'fs-promise'
import httpProxy from 'http-proxy'

/**
 * 反向代理
 */
const handlePROXY = async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'PROXY') return next()

    // todo handle ssl cert to options
    var options = {
      // protocolRewrite: 'http'
    }
    var target = location.content
    httpProxy.createProxyServer(options).web(req, res, {
      target: target,
      ssl: {
        key: fs.readFileSync('/etc/letsencrypt/live/'+req.headers.host+'/privkey.pem', 'utf8'),
        cert: fs.readFileSync('/etc/letsencrypt/live/'+req.headers.host+'/cert.pem', 'utf8')
      }
    }, function (err) {
      if (err) {
        console.log(err)
        return next(err)
      }
      res.end()
    })


  } catch(e){
    next(e)
  }

}

module.exports = handlePROXY