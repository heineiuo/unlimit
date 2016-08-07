import Joi from 'joi'
import awaitify from '../../util/awaitify'
import Location from '../../model/location'
import Host from '../../model/host'

/**
 * 获取详情
 */
module.exports = async(req, res, next) => {

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    host_id: Joi.string().required(),
    location_id: Joi.string().required()
  }), {allowUnknown: true})

  const results = await Promise.all([
    Host.findOne({_id: req.body.host_id}),
    Location.findOne({_id: req.body.location_id})
  ])

  res.body = {
    host: results[0],
    location: results[1]
  }

  res.end()


}