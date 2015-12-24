/**
 * 统一返回客户端, 路由交给客户端处理
 */
router.route(['/', '/install', '/host']).get(
  cnameApp.requireEqualHost,
  cnameApp.renderApp
)

/**
 * 客户端获取app状态(已安装/未安装)
 */
router.route('/api/status').get(
  cnameApp.requireEqualHost,
  cnameApp.status
)

/**
 * 安装app
 */
router.route('/api/install').post(
  cnameApp.install
)

/**
 * 获取cnames
 */
router.route('/api/cnames').post(
  cnameApp.requireInstall,
  cnameApp.requireEqualHost,
  cnameApp.requireAdmin
)

/**
 * 新建cname
 */
router.route('/api/cname/create').post(
  cnameApp.requireInstall,
  cnameApp.requireEqualHost,
  cnameApp.requireAdmin
)