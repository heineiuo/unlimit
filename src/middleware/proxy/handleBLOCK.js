/**
 * 黑名单域名
 */

const handleBLOCK = async (req, res, next)=>{

  try {

    const {location, url} = res.locals
    if (location.type != 'BLOCK') return next()
    res.redirect('http://www.google.com')

  } catch(e){
    next(e)
  }

}

module.exports = handleBLOCK