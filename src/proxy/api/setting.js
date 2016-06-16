import {Router} from 'express'

const router = module.exports = Router()

router.route('/list-all').get(async function(req, res, next){

  try {
    const docs = await Setting.list()
    res.json({settings: docs})
  } catch(e){
    next(e)
  }
})

router.route('/list').get(async function(req, res, next){

  try {
    const docs = await Setting.list(req.query.names)
    res.json({settings: docs})
  } catch(e){
    next(e)
  }

})


router.route('/').post(async function(req, res, next){

  try {
    const docs = await Setting.set(req.body)
    res.json({settings: docs})
  } catch(e){
    next(e)
  }
})