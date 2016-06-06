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
        'Access-Control-Allow-Origin': '*',
        'Expires': new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 一年
      }
    }, function (err) {
      if (err && !res.headersSent) {
        var lastParam = url.pathname.split('/').pop()
        if (lastParam.length && !/\./.test(lastParam)) {
          res.redirect(req.path+'/')
        } else {
          res.sendStatus(404)
        }
      }
    })


  } catch(e){
    next(e)
  }

}

module.exports = handleFILE