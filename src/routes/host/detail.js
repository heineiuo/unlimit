import Host from '../../models/host'

/**
 * 获取域名详情
 */
module.exports = async (req, res, next) => {
  if (!req.body.hasOwnProperty('hostId')) throw "LOST_PARAM"
  const item = await Host.findOne({_id: req.body.hostId})
  if (!item) throw "NOT_FOUND"
  res.body = {host: item}
  res.end()
}