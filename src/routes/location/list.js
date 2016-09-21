import Joi from 'joi'
import awaitify from '../../utils/awaitify'
import Location from '../../models/location'
import Host from '../../models/host'

/**
 * 获取location列表
 */
module.exports = async (req, res, next) => {

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    host_id: Joi.string().required()
  }), {allowUnknown: true})

  var result = {}
  req.body.host_id = decodeURIComponent(req.body.host_id)
  const item = await Host.findOne({_id: req.body.host_id})
  if (!item) return next("NOT_FOUND")
  result.host = item
  result.list = await Location.cfind({host_id: req.body.host_id})
    .sort({sort: 1}).exec()
  res.body = result
  res.end()

}