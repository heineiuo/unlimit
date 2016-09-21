import Joi from 'joi'
import awaitify from '../../utils/awaitify'
import ent from 'ent'
import Location from '../../models/location'
import Host from '../../models/host'


/**
 * 创建一条location记录
 */
module.exports = async(req, res, next) => {
  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    host_id: Joi.string().required(),
    type: Joi.string().required(),
    content: Joi.string().required()
  }), {allowUnknown: true})

  const host = await Host.findOne({_id: req.body.host_id})
  if (!host) return next('NOT_FOUND')
  req.body.type = req.body.type || 'html'
  req.body.content = req.body.type == 'html'?
    ent.encode(req.body.content):req.body.content
  const doc = await Location.cfindOne({host_id: req.body.host_id})
    .sort({sort: -1}).exec()
  req.body.sort=!doc?1:Number(doc.sort)+1
  const newLocation = await Location.insert(req.body)
  res.body = newLocation
  res.end()

}