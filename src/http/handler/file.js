import path from 'path'

/**
 * 文件下载代理
 */
const handleFILE = async (req, res, next) => {
  try {
    const {location, url} = res.locals;
    if (location.type.toUpperCase() != 'FILE') return next();
    var filePath = path.join(location.content, url.pathname);
    console.log(filePath);
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