var router = module.exports = require('express').Router()

var main = require('../controller/main')
var location = require('../controller/location')
var host = require('../controller/host')
var file = require('../controller/file')


// 获取状态(已安装/未安装)
router.route('/api/status').all(
  main.requireEqualHost,
  main.status
)

// 安装
router.route('/api/install').post(
  main.install
)

// login
router.route('/api/login').post(
  main.requireInstall,
  main.requireEqualHost,
  main.login
)


/************************
 *
 * domain和location
 *
 ************************/
// 获取域名列表
router.route('/api/host/list').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  host.list
)

// 获取域名详情
router.route('/api/host/detail').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  host.detail
)

// 创建新的域名
router.route('/api/host/new').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  host.new
)

// 编辑域名
router.route('/api/host/edit').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  host.edit
)


// 删除域名
router.route('/api/host/delete').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  host.delete
)


// 获取location列表
router.route('/api/location/list').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  location.locationListRead
)

// 获取location详情
router.route('/api/location/detail').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  location.detail
)

router.route('/api/location/new').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  location.locationCreate
)

router.route('/api/location/edit').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  location.locationUpdate
)


router.route('/api/location/delete').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  location.delete
)


/*****************************
 *
 * 文件管理相关接口
 *
 *****************************/
// 上传
router.route('/api/upload').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  file.upload
)

// 读取目录
router.route('/api/file/readdir').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  file.readdir
)

// 删除文件
router.route('/api/file/delete').post(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  file.deleteFile
)

// 下载文件
router.route('/api/file/download').get(
  main.requireInstall,
  main.requireEqualHost,
  main.requireAdmin,
  file.downloadFile
)

