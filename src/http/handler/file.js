import path from 'path'
import config from '../../utils/config'

/**
 * 文件下载代理
 */
const handleFILE = async (req, res, next) => {
  try {
    const {location, url} = res.locals;
    if (location.type.toUpperCase() != 'FILE') return next();
    var filePath = path.join(location.content, url.pathname);
    if (config.debug) console.log(filePath);
    return res.sendFile(filePath, {
      CacheControl: true,
      "maxAge": 31536000000,
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Expires": new Date(Date.now() + 31536000000)
      }
    }, function (err) {
      if (err && !res.headersSent) {
        var lastParam = url.pathname.split('/').pop()
        if (lastParam.length && !/\./.test(lastParam))
          return res.redirect(req.path+'/')
        next('NOT_FOUND')
      }
    })
  } catch(e){
    next(e)
  }
}

module.exports = handleFILE;