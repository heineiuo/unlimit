import {Router} from 'express'
const bodyParser = require('body-parser')

const router = Router()

router.use(bodyParser.json({limit: "2mb"}))
router.use(bodyParser.json({type: 'text/html'}))
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json({type: 'routerlication/*+json'}))
router.use('/host', require('./host'))
// router.use('/file', require('./file'))
router.use('/location', require('./location'))
router.use('/status', require('./status'))

module.exports = router