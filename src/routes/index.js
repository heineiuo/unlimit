import {Router} from 'seashell-client-node'

const router = new Router()

router.use('/host/list', require('./host/list'))
router.use('/host/detail', require('./host/detail'))
router.use('/host/delete', require('./host/delete'))
router.use('/host/new', require('./host/new'))

router.use('/location/new', require('./location/new'))
router.use('/location/delete', require('./location/delete'))
router.use('/location/detail', require('./location/detail'))
router.use('/location/edit', require('./location/edit'))
router.use('/location/list', require('./location/list'))
router.use('/location/new', require('./location/new'))
router.use('/location/update-sort', require('./location/update-sort'))

router.use('/fs/cat', require('./fs/cat'))
router.use('/fs/ls', require('./fs/ls'))
router.use('/fs/vi', require('./fs/vi'))
router.use('/fs/mv', require('./fs/mv'))
router.use('/fs/rm', require('./fs/rm'))
router.use('/fs/mkdir', require('./fs/mkdir'))
router.use('/terminal', require('./terminal'))

export default module.exports = router
