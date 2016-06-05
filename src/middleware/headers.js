const headers = (conf) => {
  return (req, res, next)=>{
    res.set('x-powered-by', false)
    res.set("X-Frame-Options", "SAMEORIGIN")
    if (conf.cors) res.set('Access-Control-Allow-Origin', '*')
    next()
  }
}

module.exports = headers