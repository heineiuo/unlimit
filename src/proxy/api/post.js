import {Router} from 'express'

const router = module.exports = Router()

/**
 * @param req.body.targets
 * @param req.body.content
 */
router.route('/').post(async function(req, res, next){

  try {
    const user = await User.getUser(req.body.youkuohao_token)
    let content = req.body.content||null
    if (!content) return next('CONTENT_PARAM_ILLEGAL')
    let targets = req.body.targets || []

    let post = await Post.createOne({
      user_id: user.user_id,
      content: content
    })

    targets.forEach(async (target)=> {
      switch (target) {
        case 'Quara':
          let quara = await Quara.createOne({
            user_id: user.user_id,
            post_id: post._id
          })
          break
        case 'Moment':
          let moment = await Moment.createOne({
            user_id: user.user_id,
            post_id: post._id
          })
          break
        case 'Topic':
          let Topic = await Topic.createOne({
            user_id: user.user_id,
            post_id: post._id
          })
          break
      }
    })
    res.json({})
  } catch(e){
    next(e)
  }

})

/**
 * @param req
 */
router.route('/list').get(async function(req, res, next){

  try {
    const list = await Post.list(req.query)
    res.json({list: list})
  } catch(e){
    next(e)
  }

})
/**
 * @param req
 */
router.route('/list/quara').get(async function(req, res, next){

  try {
    const list = await Quara.getList()
    res.json({list: list})
  } catch(e){
    next(e)
  }

})