/**
 * 需要和安装后的名称一致
 */

const requireEqualHost =  (conf)=>{
  return (req, res, next)=>{
    console.log(req.headers.host)
    if (req.headers.host == conf.host) return next()
    res.end(`NOT FOUND`)
  }
}

module.exports = requireEqualHost
