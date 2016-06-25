import {Router} from 'express'

/**
 * {host}/
 */
const router = module.exports = Router()

router.use('/', require('./account'))
router.use('/auth', require('./auth'))
router.use('/role', require('./role'))
router.use('/role-type', require('./role-type'))
router.use('/user', require('./user'))