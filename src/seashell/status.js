import Router from 'seashell'
const router = module.exports = new Router()


// 获取状态(已安装/未安装)
router.use('/', async (req, res, next) => {
  res.body = {
    isChecked: true,
    isInstalled: true,
    logged: true
  }

  res.end()
})
