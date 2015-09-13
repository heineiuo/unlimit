
var controller = require('../controller')

var api = controller.api

module.exports = function(app){

  // 传入code，获取token
  app.route('/api/token')
    .post(function(req, res){
      // todo 向API申请token
      res.end()
    })

  // superApp专用，传入appId，返回code
  app.route('/api/auth')
    .post(function(req, res){
      // todo 向API申请该appId具有使用当前登录用户获取code的权限
      res.end()
    })


}
