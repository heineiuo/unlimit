import {Router} from 'express'

const router = module.exports = Router()

router.route('/').get(async (req, res, next)=>{
  try {
    const {seashell} = res.locals
    const response = await seashell.request('/account/example', {})
    console.log(response)
    res.json(response.body)
  } catch(e){
    next(e)
  }
})