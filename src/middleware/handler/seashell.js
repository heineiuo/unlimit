import {Router} from 'express'
import bodyParser from 'body-parser'

const router = Router()

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())
router.use(bodyParser.json({type: 'application/*+json'}))
router.use(bodyParser.json({type: 'text/html'}))
router.use(bodyParser.json({type: 'text/plain'}))

router.use(async (req, res, next) => {
  try {
    const {location} = res.locals
    if (location.type != 'SEASHELL') return next()

    const {seashell} = res.locals
    const reqBody = Object.assign({}, req.query, req.body, {
      __METHOD: req.method
    })
    const result = await seashell.request(req.path, reqBody)
    console.log(result)
    res.json(result.body)
  } catch(e){
    next(e)
  }
})

router.use((err, req, res, next) => {
  if (!err) return next()
  if (typeof err == 'string') return res.json({error: err.toUpperCase()})
  if (typeof err == 'object') console.log(err)
  res.json({error: 'EXCEPTION_ERROR'})
})


module.exports = router