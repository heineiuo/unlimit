/**
 * 检查是否需要更新html文件
 * @param req
 * @param res
 * @param next
 * @returns {boolean}
 */
controller.updateCheck = function(req, res, next){

  next()

  if (conf.cnameUpdating) return false
  if (Date.now() < conf.cnameExpire) return false
  conf.cnameUpdating = true

  var options = {
    method: 'POST',
    url: conf.API_HOST+'/service/cname',
    form: {
      appId: conf.appId,
      appSecret: conf.appSecret
    }
  }

  console.log('正在更新....')

  request(options, function(err, data){

    if (err) {
      conf.cnameUpdating = false
      return false
    }

    try {

      var bodyJSON =  JSON.parse(data.body)
      if (bodyJSON.error) {
        return console.log('更新失败：服务器返回错误: '+bodyJSON.error)
      }
      bodyJSON.update_time = new Date()
      conf.cname = bodyJSON
      conf.cnameExpire = Date.now() + conf.timeout

      // 写入文件
      fs.writeFile(conf.appdata+'/cname.json', JSON.stringify(bodyJSON), 'utf-8', function(err){
        if (err) {
          console.log(err)
          console.log('更新失败: 保存cname信息失败')
        }
        conf.cnameUpdating = false
        console.log('更新成功.')
      })

    } catch (e){
      console.log(e)
      console.log('更新失败: 异常')
      conf.cnameUpdating = false
    }

  })

}