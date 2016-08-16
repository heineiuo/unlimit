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
    const {location, url, host} = res.locals
    if (location.type != 'SEASHELL') return next()

    const {seashell} = res.locals
    const reqBody = Object.assign({}, req.query, req.body, {
      __METHOD: req.method
    })
    const result = await seashell.request(req.path, reqBody)

    /**
     * 检查headers
     * 如果不是上传, 直接返回数据
     * 如果是上传, next()
     */
    if (!result.headers.__UPLOAD) return res.json(result.body)
    res.locals.upload = result.body
    return next()

  } catch(e){
    next(e)
  }
})

router.use(require('./upload'))

router.use((err, req, res, next) => {
  if (!err) return next()
  if (typeof err == 'string') return res.json({error: err.toUpperCase()})
  if (typeof err == 'object') console.log(err.stack||err)
  res.json({error: 'EXCEPTION_ERROR'})
})


module.exports = router