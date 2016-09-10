module.exports = () => {
  return (req, res, next)=>{
    res.removeHeader("x-powered-by")
    res.set("X-Frame-Options", "SAMEORIGIN")
    next()
  }
}