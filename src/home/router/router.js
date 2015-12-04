var mainRouter = mainRouter ||  pansy.Router()

mainRouter.route('/')
  .get(
    controller('layout'),
    controller('user.requireLogin'),
    controller('home')
  )

mainRouter.route(['/docs', '/doc'])
  .get(
    controller('layout'),
    controller('user.requireLogin')
  )

mainRouter.route('/login')
  .get(
    controller('layout'),
    controller('login')
  )


mainRouter.route('/test')
  .get(
  require('http://static1.heineiuo.com/dev/open/test.js'),
  controller('test')
)