var router = module.exports = require('express').Router()

var cname = require('../controller/cname')
var host = require('../controller/host')
var file = require('../controller/file')

// 客户端路由, 返回客户端处理
router.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(
  cname.requireEqualHost,
  cname.renderApp
)

// 获取状态(已安装/未安装)
router.route('/api/status').all(
  cname.requireEqualHost,
  cname.status
)

// 安装
router.route('/api/install').post(
  cname.install
)

// login
router.route('/api/login').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.login
)


/************************
 *
 * domain和location
 *
 ************************/
// 获取域名列表
router.route('/api/host/list').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  host.list
)

// 获取域名详情
router.route('/api/host/detail').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  host.detail
)

// 创建新的域名
router.route('/api/host/new').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  host.new
)

// 编辑域名
router.route('/api/host/edit').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  host.edit
)


// 删除域名
router.route('/api/host/delete').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  host.delete
)


// 获取cname列表
router.route('/api/cname/list').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  cname.cnameListRead
)

// 获取cname详情
router.route('/api/cname/detail').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  cname.detail
)

router.route('/api/cname/new').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  cname.cnameCreate
)

router.route('/api/cname/edit').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  cname.cnameUpdate
)


router.route('/api/cname/delete').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  cname.delete
)

/***************************
 *
 * 工具集
 *
 **************************/
router.route('/api/tool/encode/html').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin
)

router.route('/api/tool/string2number').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin
)



/*****************************
 *
 * 文件管理相关接口
 *
 *****************************/
// 上传
router.route('/api/upload').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  file.upload
)

// 读取目录
router.route('/api/file/readdir').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  file.readdir
)

// 删除文件
router.route('/api/file/delete').post(
  cname.requireInstall,
  cname.requireEqualHost,
  cname.requireAdmin,
  file.deleteFile
)

