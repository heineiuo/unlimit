var mainRouter = mainRouter ||  pansy.Router()

mainRouter.route('/cname')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('cname.list')
  )


mainRouter.route('/cname/new')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('cname.new')
  )

mainRouter.route(/^\/cname\/detail\/[0-9a-zA-Z-]+$/)
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('cname.detail')
  )


mainRouter.route(/^\/cname\/edit\/[0-9a-zA-Z-]+$/)
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('cname.edit')
  )

