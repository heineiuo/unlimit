import {Router} from 'seashell'

const router = new Router()

router.use('/host', require('./host'))
router.use('/location', require('./location'))
router.use('/status', require('./status'))


module.exports = router
