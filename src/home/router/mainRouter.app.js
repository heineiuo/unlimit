var mainRouter = mainRouter ||  pansy.Router()

mainRouter.route('/app')
  .get(
    controller('require.test'),
    controller('layout'),
    controller('user.requireLogin'),
    controller('app.list')
  )

mainRouter.route('/app/new')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('app.new')
  )

mainRouter.route(/^\/app\/detail\/[0-9a-zA-Z-]+$/)
  .get(
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.detail')
)

mainRouter.route(/^\/app\/edit\/[0-9a-zA-Z-]+$/)
  .get(
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.edit')
)

