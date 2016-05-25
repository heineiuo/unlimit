import Config from '../model/config'

var router = module.exports = require('express').Router()

// 安装
router.route('/api/install').post((req, res, next)=>{
  if (conf.isInstalled) return res.sendStatus(403)
  var options = _.omit(req.body, ['access_token', 'debug'])
  options.access_token = md5('location'+Date.now())
  Config.insert(options, function(err, doc){
    if (err) {
      console.log('安装失败')
      console.log(err)
      return res.sendStatus(500)
    }
    conf = _.extend(conf, doc)
    conf.access_token = doc.access_token
    conf.isInstalled = true
    res.json({})
  })

})