

// 获取状态(已安装/未安装)
router.route('/api/status').all(
  main.requireEqualHost,
  main.status
)
