import path from 'path'

/**
 * 文件代理
 */
const handleFILE = async (req, res, next)=>{
  try {
    const {location, url} = res.locals
    if (location.type != 'FILE') return next()
    var filePath = path.join(location.content, url.pathname)
    return res.sendFile(filePath, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "maxAge": "31536000000",
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

module.exports = handleFILE