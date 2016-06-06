import request from 'request'

/**
 * 接口代理
 */
const handleAPI = async (req, res, next)=>{

  try {

    const {location} = res.locals
    if (location.type != 'API') return next()
    var apiOptions = {
      method: req.method,
      url: location.content,
      qs: req.query,
      body: req.body
    }
    request(apiOptions, function(err, response, body){
      if (err) {
        console.log('请求外部接口失败')
        console.log(err)
        return res.sendStatus(500)
      }
      console.log('请求外部接口成功')
      res.json(JSON.parse(body))

    })


  } catch(e){
    next(e)
  }

}

module.exports = handleAPI