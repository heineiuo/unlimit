import Host from '../../model/host'
import Location from '../../model/location'

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