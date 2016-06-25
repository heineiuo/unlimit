import {Router} from 'express'
import User from '../model/User'
import Topic from '../model/Topic'

const router = module.exports = Router()

router.route('/').post(async function(req, res, next){

  try {

    const user = await User.getUser(req.body.youkuohao_token)
    req.body.user_id = user._id
    const topic = await Topic.createOne(req.body)
    res.json(topic)

  } catch(e){
    next(e)
  }

})

router.route('/list').get(async function(req, res, next){

  try {

  } catch(e){
    next(e)
  }

})


router.route('/detail/:topic_id').get(async function(req, res, next){

  try {


  } catch(e){
    next(e)
  }
})


router.route('/detail/:topic_id/delete').post(async function(req, res, next){

  try {
    const user = await User.getUser()
    const deled = await Topic.deleteOne(req.params.topic_id, user._id)
    res.json({})

  }catch(e){
    next(e)
  }

})

