
var express = require('express')
var router = module.exports = express.Router()



// login
router.route('/api/login').post(
  main.requireInstall,
  main.requireEqualHost,
  main.login
)
