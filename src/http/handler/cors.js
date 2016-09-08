
/**
 * 允许跨域
 */

const handleCORS = async (req, res, next)=>{
  try {
    if (res.locals.location.cors == 'ALLOW'){
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Expose-Headers', '*')
      res.set('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')
      res.set('Access-Control-Allow-Methods', '*')
    }
    next()
  } catch(e){
    next(e)
  }
}

module.exports = handleCORS