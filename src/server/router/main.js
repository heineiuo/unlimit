/**
 * 统一返回客户端, 路由交给客户端处理
 */
router.route(/^(?!\/api\/)[a-zA-Z0-9\_\-\/]*$/).get(
  cnameController.requireEqualHost,
  cnameController.renderApp
)

/**
 * 客户端获取app状态(已安装/未安装)
 */
router.route('/api/status').all(
  cnameController.requireEqualHost,
  cnameController.status
)

/**
 * 安装app
 */
router.route('/api/install').post(
  cnameController.install
)

/**
 * 获取cnames
 */
router.route('/api/cnames').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin
)

/**
 * 新建cname
 */
router.route('/api/cname/create').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin
)


/**
 * login
 */
router.route('/api/login').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.login
)

//
//// 获取app列表
//router.route('/api/app/list').post(
//  cnameController.requireInstall,
//  cnameController.requireEqualHost,
//  cnameController.requireAdmin
//
//)
//
//// 获取app详情
//router.route('/api/app/detail').post(
//  cnameController.requireInstall,
//  cnameController.requireEqualHost,
//  cnameController.requireAdmin
//)
//
//// 创建新的app
//router.route('/api/app/new').post(
//  cnameController.requireInstall,
//  cnameController.requireEqualHost,
//  cnameController.requireAdmin
//)
//
//// 编辑app
//router.route('/api/app/edit').post(
//  cnameController.requireInstall,
//  cnameController.requireEqualHost,
//  cnameController.requireAdmin
//)



// 获取cname列表
router.route('/api/cname/list').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  cnameController.cnameListRead
)

// 获取cname详情
router.route('/api/cname/detail').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  cnameController.cnameReadByUrl
)

router.route('/api/cname/new').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  cnameController.cnameCreate
)

router.route('/api/cname/edit').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  cnameController.cnameUpdate
)


router.route('/api/cname/delete').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  cnameController.delete
)


// 获取app列表
router.route('/api/host/list').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  hostController.list
)

// 获取app详情
router.route('/api/host/detail').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  hostController.detail
)

// 创建新的app
router.route('/api/host/new').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  hostController.new
)

// 编辑app
router.route('/api/host/edit').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin,
  hostController.edit
)



router.route('/api/upload').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin
)

router.route('/api/tool/encode/html').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin
)

router.route('/api/tool/string2number').post(
  cnameController.requireInstall,
  cnameController.requireEqualHost,
  cnameController.requireAdmin
)
