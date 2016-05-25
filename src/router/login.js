


// login
router.route('/api/login').post(
  main.requireInstall,
  main.requireEqualHost,
  main.login
)
