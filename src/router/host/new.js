import Joi from 'joi'
import awaitify from '../../util/awaitify'
import Host from '../../model/host'

/**
 * 创建新的域名
 */
module.exports = async (req, res, next) => {

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    hostname: Joi.string().required()
  }), {allowUnknown: true})

  const host = await Host.findOne({hostname: req.body.hostname})
  if (host) throw 'PERMISSION_DENIED'
  const createdHost = await Host.insert({hostname: req.body.hostname})
  res.body = {host: createdHost}
  res.end()

}