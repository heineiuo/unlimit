/**
 * 黑名单域名
 */
const handleBLOCK = async (req, res, next)=>{
  try {
    const {location, url} = res.locals;
    if (location.type.toUpperCase() != 'BLOCK') return next();
    res.redirect(`https://www.google.com/s?q=${req.headers.host} is dangerous.`)
  } catch(e){
    next(e)
  }
};

module.exports = handleBLOCK
