var router = module.exports = require('pansy').Router()

var layout = require('../controller/layout')
var home = require('../controller/home')
var cname = require('../controller/cname')
var host = require('../controller/host')
var install = require('../controller/install')
var login = require('../controller/login')
var user = require('../controller/user')
var file = require('../controller/file')
var cli = require('../controller/cli')

router.route('/install').get(
  user.getStatus,
  layout.renderLayout,
  install.renderInstall
)

router.route('/').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  home.renderHome
)

router.route('/login').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  login.renderLogin
)

router.route('/host').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.list
)

router.route('/host/new').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.new
)


router.route(/^\/host\/[0-9a-zA-Z-]{16}$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.detail
)


router.route(/^\/host\/[0-9a-zA-Z-]{16}\/cname\/new$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  cname.new
)

router.route(/^\/host\/[0-9a-zA-Z-]{16}\/cname\/[0-9a-zA-Z-]{16}$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  cname.edit
)

router.route('/file').get(
  user.getStatus,
  user.requireLogin,
  install.requireInstall,
  layout.renderLayout,
  file.renderMedia
)


/*******************************
 *
 * 网页版命令行工具
 *
 *******************************/
router.route('/cli').get(
  user.getStatus,
  user.requireLogin,
  install.requireInstall,
  layout.renderLayout,
  cli.renderCLI
)