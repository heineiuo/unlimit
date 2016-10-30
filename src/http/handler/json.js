
/**
 * 返回json
 */
const handleJSON = async (req, res, next)=>{

  try {
    const {location} = res.locals;
    if (location.type.toUpperCase() != 'JSON') return next();
    return res.json(JSON.parse(location.content));

  } catch(e){
    next(e)
  }

}

module.exports = handleJSON