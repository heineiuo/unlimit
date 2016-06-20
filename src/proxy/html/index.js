import ent from 'ent'

/**
 * 返回html
 */

const handleHTML = async (req, res, next)=>{

  try {

    const {location} = res.locals

    if (location.type != 'HTML') return next()
    if (location.contentType=='file'){
      res.sendFile(location.content, {
        headers: {
          'Expires': new Date(Date.now() + 1000 * 10) // 10s
        }
      }, function (err) {
        if (err && !res.headersSent) res.sendStatus(404)
      })
    } else {
      res.end(ent.decode(location.content))
    }

  } catch(e){
    next(e)
  }

}

module.exports = handleHTML