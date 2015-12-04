var mainRouter = mainRouter ||  pansy.Router()

mainRouter.route('/host')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('host.list')
  )

mainRouter.route('/host/new')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('host.new')
  )


mainRouter.route(/^\/host\/detail\/[0-9a-zA-Z-]+$/)
  .get(
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.detail')
)


mainRouter.route(/^\/host\/edit\/[0-9a-zA-Z-]+$/)
  .get(
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.edit')
)
