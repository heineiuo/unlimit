import Joi from 'joi'
import awaitify from '../../utils/awaitify'
import Location from '../../models/location'

/**
 * 修改排序
 * @param req
 * @param res
 * @param next
 */
module.exports = async(req, res, next) => {

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    location_id: Joi.string().required(),
    targetSort: Joi.string().required()
  }), {allowUnknown: true})

  var targetSort = Number(req.body.targetSort)
  if (targetSort < 1) return next('PARAMS_ILLEGAL')

  const targetLocation = await Location.findOne({_id: req.body.location_id})
  const docs = await Location.find({host_id: targetLocation.host_id})

  if (!targetLocation) return next('NOT_FOUND')
  if (targetSort == targetLocation.sort) return next('NOT_CHANGED')
  if (targetSort > docs.length) return next('PARAMS_ILLEGAL')

  targetLocation.sort = Number(targetLocation.sort)

  const sort = targetSort < targetLocation.sort?{
    // sort调小,那么在目标sort和当前sort内的记录都要+1, 再把当前sort调到目标sort
    $gte: targetSort,
    $lt: targetLocation.sort
  }:{
    // 调大, 那么在目标sort和当前sort内的记录都要-1, 再把当前sort调到目标sort
    $lte: targetSort,
    $gt: targetLocation.sort
  }

  const shouldUpdateDocs = await Location.find({
    host_id: targetLocation.host_id,
    sort: sort
  })
  await Promise.all(shouldUpdateDocs.map(item => {
    item.sort = Number(item.sort)
    targetSort < targetLocation.sort?item.sort ++ : item.sort --
    return Location.update({_id: item._id}, {$set: {sort: item.sort}}, {})
  }))
  await Location.update({_id: req.body.location_id}, {$set: {
    sort: targetSort
  }}, {})

  res.body = {success: 1}
  res.end()

}