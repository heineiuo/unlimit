var mainRouter = mainRouter ||  pansy.Router()

mainRouter.route('/install').get(
  controller('layout'),
  controller('renderInstall')
)

mainRouter.route('/').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('home')
)

mainRouter.route(['/docs', '/doc']).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin')
)

mainRouter.route('/login').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('renderLogin')
)


mainRouter.route('/host').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.list')
)

mainRouter.route('/host/new').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.new')
)


mainRouter.route(/^\/host\/[0-9a-zA-Z-]+\/detail$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.detail')
)


mainRouter.route(/^\/host\/[0-9a-zA-Z-]+\/edit$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('host.edit')
)


mainRouter.route('/app').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.list')
)

mainRouter.route('/app/new').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.new')
)

mainRouter.route(/^\/app\/detail\/[0-9a-zA-Z-]+$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.detail')
)

mainRouter.route(/^\/app\/edit\/[0-9a-zA-Z-]+$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('app.edit')
)



mainRouter.route('/cname').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('cname.list')
)


mainRouter.route('/cname/new').get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('cname.new')
)

mainRouter.route(/^\/cname\/detail\/[0-9a-zA-Z-]+$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('cname.detail')
)


mainRouter.route(/^\/cname\/edit\/[0-9a-zA-Z-]+$/).get(
  controller('requireInstalled'),
  controller('layout'),
  controller('user.requireLogin'),
  controller('cname.edit')
)



