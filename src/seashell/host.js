import Joi from 'joi'
import awaitify from '../util/awaitify'
import _ from 'lodash'
import Host from '../model/host'
import Location from '../model/location'
import {Router} from 'seashell'

const router = new Router()

/************************
 *
 * domain和location
 *
 ************************/

// 获取域名列表
router.use('/list', async(req, res, next)=> {

  try {
    const docs = await Host.find({})
    res.json({list: docs})
  } catch(e){
    next(e)
  }


})

// 获取域名详情
router.use('/detail', async (req, res, next) => {
  try {
    if (!_.has(req.body, 'hostId')) return res.json({error: "LOST_PARAM"})
    var result = {}
    const item = Host.findOne({_id: req.body.hostId})
    if (!item) return res.json({error: "NOT_FOUND"})
    result.host = item
    res.json(result)
  } catch(e){
    next(e)
  }

})

// 创建新的域名
router.use('/new', async (req, res, next) => {

  try {
    console.log(req.body)
    await awaitify(Joi.validate)(req.body, Joi.object().keys({
      hostname: Joi.string().required()
    }), {allowUnknown: true})

    const host = await Host.findOne({hostname: req.body.hostname})
    if (host) throw 'PERMISSION_DENIED'
    const createdHost = await Host.insert({hostname: req.body.hostname})
    res.json({host: createdHost})

  } catch(e) {
    next(e)
  }



})

/**
 * 编辑域名
 */
router.use('/edit', (req, res, next) =>{
  next('API_BUILDING')
})

// 删除域名
router.use('/delete', async(req, res, next)=> {

  if (!_.has(req.body, 'hostId')) return res.json({error: "PERMISSION_DENIED"})

  try {
    const promises = [
      Host.remove({_id: req.body.hostId}, {}),
      Location.remove({host_id: req.body.hostId}, {multi: true})
    ]
    await Promise.all(promises)
  } catch(e){
    next(e)
  }


})


module.exports = router