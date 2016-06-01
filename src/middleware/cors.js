const corsMiddleware = (conf) => {
  return (req, res, next)=>{
    if (conf.cors) {
      res.set('Access-Control-Allow-Origin', '*')
    }
    next()
  }
}

module.exports = corsMiddleware