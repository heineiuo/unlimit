var router = require('express').Router()

router.route('/admin').get(controller.requireAdmin)