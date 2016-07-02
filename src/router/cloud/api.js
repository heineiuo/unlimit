import {Router} from 'express'
const bodyParser = require('body-parser')

const router = module.exports = Router()

router.use(bodyParser.json({limit: "2mb"}))
router.use(bodyParser.json({type: 'text/html'}))
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json({type: 'routerlication/*+json'}))
router.use('/host', require('./host'))
// router.use('/api/file', require('./file'))
router.use('/location', require('./location'))
router.use('/status', require('./status'))

router.use((err, req, res, next) => {
  console.log(err)
  if (typeof err == 'object') return res.json({error: err.name})
  if (typeof err == 'string') return res.json({error: err})
  res.json({error: 'EXCEPTION_ERROR'})
})