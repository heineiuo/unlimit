var mainRouter = module.exports = require('pansy').Router()

var layout = require('../controller/layout')
var home = require('../controller/home')
var cname = require('../controller/cname')
var host = require('../controller/host')
var install = require('../controller/install')
var login = require('../controller/login')
var user = require('../controller/user')

mainRouter.route('/install').get(
  user.getStatus,
  layout.renderLayout,
  install.renderInstall
)

mainRouter.route('/').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  home.renderHome
)

mainRouter.route('/login').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  login.renderLogin
)


mainRouter.route('/host').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.list
)

mainRouter.route('/host/new').get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.new
)


mainRouter.route(/^\/host\/[0-9a-zA-Z-]{16}$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  host.detail
)


mainRouter.route(/^\/host\/[0-9a-zA-Z-]{16}\/cname\/new$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  cname.new
)

mainRouter.route(/^\/host\/[0-9a-zA-Z-]{16}\/cname\/[0-9a-zA-Z-]{16}$/).get(
  user.getStatus,
  install.requireInstall,
  layout.renderLayout,
  user.requireLogin,
  cname.edit
)



