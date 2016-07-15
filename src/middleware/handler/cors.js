
/**
 * 允许跨域
 */

const handleCORS = async (req, res, next)=>{
  try {
    console.log('res.locals.location')
    console.log(res.locals.location)
    if (res.locals.location.cors == 'ALLOW'){
      res.set('Access-Control-Allow-Origin', '*')
    }
    next()
  } catch(e){
    next(e)
  }
}

module.exports = handleCORS