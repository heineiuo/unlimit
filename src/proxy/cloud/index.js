import express, {Router} from 'express'
const bodyParser = require('body-parser')

const router = Router()

router.use((req, res, next)=>{
  res.locals.time3 = Date.now()
  console.log(res.locals.time3 - res.locals.time2 + 'ms, tag2')
  if (!res.locals.isCloud) return next('IS_NOT_CLOUD')
  next()
})
router.use('/api', bodyParser.json({limit: "2mb"}))
router.use('/api', bodyParser.json({type: 'text/html'}))
router.use('/api', bodyParser.urlencoded({extended: true}))
router.use('/api', bodyParser.json({type: 'routerlication/*+json'}))
router.use('/api/host', require('./host'))
// router.use('/api/file', require('./file'))
router.use('/api/location', require('./location'))
router.use('/api/status', require('./status'))

router.use((req, res, next)=>{
  res.locals.time4 = Date.now()
  console.log(res.locals.time4 - res.locals.time3 + 'ms, tag3')
  next()
})

router.use('/file', express.static(`${process.cwd()}/data/file`, {
  maxAge: 31536000000
}))
router.use(express.static(`${process.cwd()}/public`, {
  maxAge: 31536000000
}))

router.use(async (err, req, res, next) => {
  if (!err) return res.end('NOT_FOUND')
  if (err=='IS_NOT_CLOUD') return next()
  if (typeof err == 'string') return res.end(err)
  res.end('EXCEPTION_ERROR')
})

module.exports = router