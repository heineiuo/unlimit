
/**
 * 重定向
 */

const handleREDIRECT = async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'REDIRECT') return next()
    res.redirect(location.content)

  } catch(e){
    next(e)
  }

}
module.exports = handleREDIRECT
