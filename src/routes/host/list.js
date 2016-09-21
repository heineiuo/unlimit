import Host from '../../models/host'

/**
 * 获取域名列表
 */
module.exports = async(req, res, next)=> {

  const docs = await Host.find({})
  res.body = {list: docs}
  res.end()

}