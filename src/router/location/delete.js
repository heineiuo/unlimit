import Joi from 'joi'
import awaitify from '../../util/awaitify'
import Location from '../../model/location'

/**
 * 删除一个location
 */
module.exports = async(req, res, next)=> {
  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    locationId: Joi.string().required()
  }), {allowUnknown: true})
  await Location.remove({_id: req.body.locationId})
  res.body = {success: 1}
  res.end()
}