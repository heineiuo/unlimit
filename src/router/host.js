import Joi from 'joi'
import awaitify from '../util/awaitify'
import Host from '../model/host'
import Location from '../model/location'
import {Router} from 'seashell'

const router = new Router()

/************************
 *
 * domain和location
 *
 ************************/

/**
 * 获取域名列表
 */
router.use('/list', async(req, res, next)=> {

  const docs = await Host.find({})
  res.body = {list: docs}
  res.end()

})

/**
 * 获取域名详情
 */
router.use('/detail', async (req, res, next) => {
  if (!req.body.hasOwnProperty('hostId')) throw "LOST_PARAM"
  const item = await Host.findOne({_id: req.body.hostId})
  if (!item) throw "NOT_FOUND"
  res.body = {host: item}
  res.end()
})

/**
 * 创建新的域名
 */
router.use('/new', async (req, res, next) => {

  await awaitify(Joi.validate)(req.body, Joi.object().keys({
    hostname: Joi.string().required()
  }), {allowUnknown: true})

  const host = await Host.findOne({hostname: req.body.hostname})
  if (host) throw 'PERMISSION_DENIED'
  const createdHost = await Host.insert({hostname: req.body.hostname})
  res.body = {host: createdHost}
  res.end()

})

/**
 * 编辑域名
 */
router.use('/edit', (req, res, next) =>{
  next('API_BUILDING')
})

/**
 * 删除域名
 */
router.use('/delete', async(req, res, next)=> {

  if (!req.body.hasOwnProperty('hostId')) throw "PERMISSION_DENIED"
  const promises = [
    Host.remove({_id: req.body.hostId}, {}),
    Location.remove({host_id: req.body.hostId}, {multi: true})
  ]
  await Promise.all(promises)
  res.body = {success: 1}
  res.end()

})


module.exports = router