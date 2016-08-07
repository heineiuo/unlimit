import Joi from 'joi'
import awaitify from '../../util/awaitify'
import ent from 'ent'
import Location from '../../model/location'

/**
 * 更新已有的记录
 * @param req
 * @param res
 */
module.exports = async (req, res, next) => {

  console.log(req.body)

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    type: Joi.string().required(),
    content: Joi.string().required(),
    pathname: Joi.string().required()
  }), {allowUnknown: true})

  if (req.body.type == 'html' && req.body.contentType == 'text') {
    req.body.content = ent.encode(req.body.content)
  }

  req.body.pathname = req.body.pathname.toString()

  const numReplaced = await Location.update({_id: req.body._id}, {$set: {
    type: req.body.type,
    cors: Boolean(req.body.cors),
    contentType: req.body.contentType,
    content: req.body.content,
    pathname: req.body.pathname
  }})

  if (numReplaced==0) return next('LOCATION_NOT_FOUND')
  res.body = {success:1}
  res.end()

}