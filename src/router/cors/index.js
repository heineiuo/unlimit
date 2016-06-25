
/**
 * 允许跨域
 */

const handleCORS = async (req, res, next)=>{
  try {
    if (res.locals.location.cors == 'ALLOW'){
      res.set('Access-Control-Allow-Origin', '*')
    }
    next()
  } catch(e){
    next(e)
  }
}

module.exports = handleCORS