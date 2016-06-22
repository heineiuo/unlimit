import {Router} from 'express'

const router = module.exports = Router()

router.use('/receive', require('./receive'))
router.use('/menu', require('./menu'))
router.use('/kf', require('./kf'))
router.use('/media', require('./media'))
router.use('/jsapi', require('./jsapi'))
router.use('/account', require('./account'))
router.use('/auth', require('./auth'))
