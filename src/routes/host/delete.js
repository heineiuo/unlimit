import Host from '../../models/host'
import Location from '../../models/location'

/**
 * 删除域名
 */
module.exports = async(req, res, next) => {

  if (!req.body.hasOwnProperty('hostId')) throw "PERMISSION_DENIED"
  const promises = [
    Host.remove({_id: req.body.hostId}, {}),
    Location.remove({host_id: req.body.hostId}, {multi: true})
  ]
  await Promise.all(promises)
  res.body = {success: 1}
  res.end()

}