import Host from '../../model/host'


/**
 * 查询host
 */
const getHost = async (req, res, next)=>{

  try {
    const doc = await Host.findOne({hostname: req.headers.host})
    if (!doc) return next('HOST_NOT_FOUND')
    res.locals.host = doc
    next()

  } catch(e){
    next(e)
  }

}

module.exports = getHost